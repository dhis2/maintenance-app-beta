import { useAlert, useDataEngine, useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip, InputFieldFF } from '@dhis2/ui'
import React, { useMemo } from 'react'
import { Field, Form, useFormState } from 'react-final-form'
import { FORM_ERROR } from 'final-form'
import {
    BaseListModel,
    getTranslatedProperty,
    useSchemaFromHandle,
} from '../../../lib'
import { camelCaseToConstantCase } from '../../../lib/utils'
import { constantCaseToCamelCase } from '../../../lib/utils/caseTransformers'
import { Query, WrapQueryResponse } from '../../../types'
import { WebLocale, Translation } from '../../../types/generated'
import { LoadingSpinner } from '../../loading/LoadingSpinner'
import style from './translation.module.css'
import {
    useInitialValues,
    transformFormValues,
    FormObj,
    TranslationType,
    useLocales,
} from './translationFormHooks'

export const TranslationForm = ({
    model,
    selectedLocale,
    setSelectedLocale,
    onClose,
}: {
    model: BaseListModel
    selectedLocale: WebLocale
    setSelectedLocale: (selectedLocale: WebLocale) => void
    onClose: () => void
}) => {
    const initialValues = useInitialValues(model, selectedLocale)
    const { data: translations, refetch } = useLocales(model.id)

    const { show } = useAlert(
        ({ message }) => message,
        ({ isSuccess }) => (isSuccess ? { success: true } : { critical: true })
    )
    const engine = useDataEngine()
    const schema = useSchemaFromHandle()

    if (!initialValues) {
        return <LoadingSpinner />
    }

    const submitForm = async (values: FormObj) => {
        const formData = transformFormValues(values, selectedLocale)
        const withoutFormTranslations =
            translations?.translations.filter((t) => {
                const translation = formData.find(
                    (formTranslation) =>
                        formTranslation.locale === t.locale &&
                        formTranslation.property === t.property
                )
                return !translation
            }) || []

        const allTranslations = withoutFormTranslations
            .concat(formData)
            .filter((t) => t.value != undefined)

        try {
            const UPDATE_MUTATION = {
                resource: `${schema.plural}`,
                type: 'update',
                id: `${model.id}/translations`,
                data: {
                    translations: allTranslations,
                },
            } as const

            await engine.mutate(UPDATE_MUTATION)
            refetch()
            show({
                message: i18n.t('Translation updated successfully'),
                isSuccess: true,
            })
        } catch (error) {
            return { [FORM_ERROR]: (error as Error | string).toString() }
        }
    }

    return (
        <Form
            onSubmit={submitForm}
            initialValues={initialValues}
            subscription={{ submitting: true, submitError: true }}
        >
            {({ handleSubmit, submitting, submitError }) => (
                <form onSubmit={handleSubmit}>
                    <>
                        <TranslationFormFields initialValues={initialValues} />
                        <ButtonStrip>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button primary type="submit" disabled={submitting}>
                                {i18n.t('Save')}
                            </Button>
                            <Button
                                primary
                                type="submit"
                                disabled={submitting}
                                onClick={() => handleSubmit() && onClose()}
                            >
                                {i18n.t('Save and close')}
                            </Button>
                        </ButtonStrip>
                    </>
                </form>
            )}
        </Form>
    )
}

export const TranslationFormFields = () => {
<<<<<<< HEAD
    const { initialValues } = useFormState({
        subscription: { initialValues: true },
    })

    return Object.keys(initialValues).map((fieldName) => (
        <Field<string | undefined>
            key={fieldName}
            name={fieldName}
            component={InputFieldFF}
            label={getTranslatedProperty(constantCaseToCamelCase(fieldName))}
        />
    ))
=======
    const { initialValues } = useFormState()

    return (
        <>
            {Object.keys(initialValues).map((fieldName) => (
                <Field<string | undefined>
                    className={style.row}
                    key={fieldName}
                    name={fieldName}
                    component={InputFieldFF}
                    label={getTranslatedProperty(
                        constantCaseToCamelCase(fieldName)
                    )}
                />
            ))}
        </>
    )
>>>>>>> cbe12cd (fix(list): translation dialog mutation fix)
}
