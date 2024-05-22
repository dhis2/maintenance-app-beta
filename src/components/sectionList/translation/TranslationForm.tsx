import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip, InputField, InputFieldFF } from '@dhis2/ui'
import { FORM_ERROR } from 'final-form'
import React from 'react'
import { Field, Form } from 'react-final-form'
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
    transformFormValues,
    FormObj,
    useLocales,
    initialFormObj,
    useInitialFieldsAndValues,
} from './translationFormHooks'

export const TranslationForm = ({
    model,
    selectedLocale,
    setSelectedLocale,
    onClose,
}: {
    model: BaseListModel
    selectedLocale?: WebLocale | undefined
    onClose: () => void
}) => {
    const engine = useDataEngine()
    const schema = useSchemaFromHandle()

    const { show } = useAlert(
        ({ message }) => message,
        ({ isSuccess }) => (isSuccess ? { success: true } : { critical: true })
    )

    const { data: translations, refetch } = useLocales(model.id)

    const initialFields = useInitialFieldsAndValues(model, selectedLocale)

    if (!initialFields) {
        return <LoadingSpinner />
    }

    const submitForm = async (values: FormObj) => {
        const formData =
            selectedLocale && transformFormValues(values, selectedLocale)
        const withoutFormTranslations =
            translations?.translations.filter((t) => {
                const translation =
                    formData &&
                    formData.find(
                        (formTranslation) =>
                            formTranslation.locale === t.locale &&
                            formTranslation.property === t.property
                    )
                return !translation
            }) || []

        const allTranslations =
            formData &&
            withoutFormTranslations
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
            initialValues={initialFormObj}
            subscription={{ submitting: true, submitError: true }}
        >
            {({ handleSubmit, submitting, submitError }) => (
                <form onSubmit={handleSubmit}>
                    <>
                        <div className={style.formObj}>
                            <div className={style.formSection}>
                                {initialFields &&
                                    Object.entries(initialFields).map(
                                        ([key, value]) => (
                                            <InputField
                                                className={style.row}
                                                key={key}
                                                label={getTranslatedProperty(
                                                    constantCaseToCamelCase(key)
                                                )}
                                                disabled
                                                value={
                                                    value as string | undefined
                                                }
                                            />
                                        )
                                    )}
                            </div>

                            {selectedLocale ? (
                                <div className={style.formSection}>
                                    {Object.keys(initialFormObj).map(
                                        (fieldName) => (
                                            <Field<string | undefined>
                                                className={style.row}
                                                key={fieldName}
                                                name={fieldName}
                                                component={InputFieldFF}
                                                label={getTranslatedProperty(
                                                    constantCaseToCamelCase(
                                                        fieldName
                                                    )
                                                )}
                                            />
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className={style.warnText}>
                                    {i18n.t(
                                        'Choose a Locale to translate from the menu above'
                                    )}
                                </p>
                            )}
                        </div>
                        <ButtonStrip end>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button
                                primary
                                type="submit"
                                disabled={submitting}
                                onClick={() => handleSubmit() && onClose()}
                            >
                                {i18n.t('Save translations')}
                            </Button>
                        </ButtonStrip>
                    </>
                </form>
            )}
        </Form>
    )
}
