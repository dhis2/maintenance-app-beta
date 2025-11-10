import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useQueryClient } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FormBase } from '../../components'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import {
    getSectionPath,
    SECTIONS_MAP,
    useNavigateWithSearchState,
} from '../../lib'
import { createFormError } from '../../lib/form/createFormError'
import { EnhancedOnSubmit } from '../../lib/form/useOnSubmit'
import { ModelWithAttributeValues } from '../../lib/form/createJsonPatchOperations'
import { LocaleFormFields } from './form/LocaleFormFields'
import { initialValues, validate } from './form/LocaleSchema'

const section = SECTIONS_MAP.locale

const useOnSubmitLocale = (): EnhancedOnSubmit<
    ModelWithAttributeValues & { language?: string; country?: string }
> => {
    const dataEngine = useDataEngine()
    const queryClient = useQueryClient()
    const saveAlert = useAlert(
        ({ message }) => message,
        (options) => options
    )
    const navigate = useNavigateWithSearchState()
    const [searchParams] = useSearchParams()

    return useMemo(
        () => async (values, form, options) => {
            if (!values) {
                console.error('Tried to save new object without any changes', {
                    values,
                })
                saveAlert.show({
                    message: i18n.t('Cannot save empty object'),
                    error: true,
                })
                return
            }

            const { language, country } = values

            if (!language || !country) {
                saveAlert.show({
                    message: i18n.t('Language and country are required'),
                    error: true,
                })
                return
            }

            try {
                const response = await dataEngine.mutate({
                    resource: 'locales/dbLocales',
                    type: 'create',
                    params: {
                        country,
                        language,
                    },
                    data: {},
                })

                saveAlert.show({
                    message: i18n.t('Created successfully'),
                    success: true,
                })

                queryClient.invalidateQueries({
                    queryKey: [{ resource: section.namePlural }],
                })

                const navigateTo = options?.navigateTo
                if (navigateTo) {
                    const navTo = navigateTo({
                        section,
                        submitAction: options?.submitAction,
                        responseData: response,
                        searchParams,
                    })
                    if (navTo) {
                        navigate(navTo)
                    }
                } else {
                    // Default navigation
                    navigate(`/${getSectionPath(section)}`)
                }

                return
            } catch (error) {
                return createFormError(error)
            }
        },
        [dataEngine, queryClient, saveAlert, navigate, searchParams]
    )
}

export const Component = () => {
    const onSubmit = useOnSubmitLocale()

    return (
        <FormBase
            initialValues={initialValues as typeof initialValues & { id?: string }}
            onSubmit={onSubmit}
            validate={validate}
            includeAttributes={false}
        >
            <DefaultNewFormContents section={section}>
                <LocaleFormFields />
            </DefaultNewFormContents>
        </FormBase>
    )
}

