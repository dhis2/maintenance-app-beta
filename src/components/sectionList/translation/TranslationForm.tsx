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
import { camelCaseToConstantCase } from '../../../lib/utils/caseTransformers'
import { WebLocale } from '../../../types/generated'
import { LoadingSpinner } from '../../loading/LoadingSpinner'
import style from './translation.module.css'
import {
    transformFormValues,
    useInitialFieldsAndValues,
    useBaseReferenceValues,
} from './translationFormHooks'

type TranslationValues = Record<string, string>

type Locale = string

export type TranslationFormValues = Record<Locale, TranslationValues>

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

    const translatableFields = Object.values(schema.properties)
        .filter((field) => field.translatable)
        .map((field) => field.name)

    const { data: baseReferenceValues } = useBaseReferenceValues({
        modelNamePlural: schema.plural,
        modelId: model.id,
        translatableFields,
    })

    const initialFields = useInitialFieldsAndValues({
        modelId: model.id,
        modelNamePlural: schema.plural,
    })

    if (!initialFields || !baseReferenceValues) {
        return <LoadingSpinner />
    }

    const submitForm = async (values: TranslationFormValues) => {
        if (!selectedLocale) {
            return undefined
        }
        const formData = transformFormValues(values)

        try {
            const UPDATE_MUTATION = {
                resource: `${schema.plural}`,
                type: 'update',
                id: `${model.id}/translations`,
                data: {
                    translations: formData,
                },
            } as const

            await engine.mutate(UPDATE_MUTATION)

            show({
                message: i18n.t('Translation updated successfully'),
                isSuccess: true,
            })
            onClose()
        } catch (error) {
            return { [FORM_ERROR]: (error as Error | string).toString() }
        }
    }

    return (
        <Form
            onSubmit={submitForm}
            initialValues={initialFields}
            subscription={{ submitting: true, submitError: true }}
        >
            {({ handleSubmit, submitting, submitError }) => (
                <form onSubmit={handleSubmit}>
                    <div className={style.formObj}>
                        <div className={style.formSection}>
                            {translatableFields.map((field) => (
                                <InputField
                                    className={style.row}
                                    key={field}
                                    label={getTranslatedProperty(field)}
                                    disabled
                                    value={baseReferenceValues[field]}
                                />
                            ))}
                        </div>

                        {selectedLocale ? (
                            <div className={style.formSection}>
                                {translatableFields.map((fieldName) => (
                                    <Field<string | undefined>
                                        className={style.row}
                                        key={fieldName}
                                        name={`${
                                            selectedLocale.locale
                                        }.${camelCaseToConstantCase(
                                            fieldName
                                        )}`}
                                        component={InputFieldFF}
                                        label={getTranslatedProperty(fieldName)}
                                    />
                                ))}
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
                            loading={submitting}
                            onClick={() => handleSubmit()}
                        >
                            {i18n.t('Save translations')}
                        </Button>
                    </ButtonStrip>
                </form>
            )}
        </Form>
    )
}
