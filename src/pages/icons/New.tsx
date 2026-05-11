import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useQueryClient } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import {
    FormBase,
    StandardFormActions,
    StandardFormSection,
    useFormBase,
} from '../../components'
import classes from '../../components/form/DefaultFormContents.module.css'
import { DefaultFormErrorNotice } from '../../components/form/DefaultFormErrorNotice'
import {
    getSectionPath,
    SECTIONS_MAP,
    useNavigateWithSearchState,
} from '../../lib'
import { createFormError } from '../../lib/form/createFormError'
import { EnhancedOnSubmit } from '../../lib/form/useOnSubmit'
import {
    IconNewFormFields,
    newInitialValues,
    stringToKeywords,
    validateNew,
} from './form'

const section = SECTIONS_MAP.icon

type IconNewSubmitValues = typeof newInitialValues & { id?: string }

const useOnSubmitNewIcon = (): EnhancedOnSubmit<IconNewSubmitValues> => {
    const dataEngine = useDataEngine()
    const queryClient = useQueryClient()
    const saveAlert = useAlert(
        ({ message }) => message,
        (options) => options
    )
    const navigate = useNavigateWithSearchState()

    return useMemo(
        () => async (values) => {
            if (!values.fileResourceId) {
                return { fileResourceId: i18n.t('Required') }
            }

            try {
                await dataEngine.mutate({
                    resource: 'icons',
                    type: 'create',
                    data: {
                        key: values.key,
                        description: values.description ?? '',
                        keywords: stringToKeywords(values.keywords),
                        fileResourceId: values.fileResourceId,
                    },
                })

                saveAlert.show({
                    message: i18n.t('Icon created successfully'),
                    success: true,
                })
                queryClient.invalidateQueries({
                    queryKey: [{ resource: section.namePlural }],
                })
                navigate(`/${getSectionPath(section)}`)
            } catch (error) {
                return createFormError(error)
            }
        },
        [dataEngine, queryClient, saveAlert, navigate]
    )
}

export const Component = () => {
    const onSubmit = useOnSubmitNewIcon()
    const { setSubmitAction } = useFormBase()
    const listPath = `/${getSectionPath(section)}`

    return (
        <FormBase
            initialValues={
                newInitialValues as typeof newInitialValues & { id?: string }
            }
            onSubmit={onSubmit}
            validate={validateNew}
            includeAttributes={false}
        >
            {({ handleSubmit, submitting }) => (
                <div className={classes.form}>
                    <IconNewFormFields />
                    <StandardFormSection>
                        <DefaultFormErrorNotice />
                    </StandardFormSection>
                    <StandardFormActions
                        cancelLabel={i18n.t('Exit without saving')}
                        submitLabel={i18n.t('Create icon')}
                        onSaveClick={undefined}
                        onSubmitClick={() => {
                            setSubmitAction('saveAndExit')
                            handleSubmit()
                        }}
                        submitting={submitting}
                        cancelTo={listPath}
                    />
                </div>
            )}
        </FormBase>
    )
}
