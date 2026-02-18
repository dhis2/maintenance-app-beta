import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip, NoticeBox } from '@dhis2/ui'
import { FORM_ERROR } from 'final-form'
import React from 'react'
import { Form } from 'react-final-form'
import {
    BaseListModel,
    Schema,
    SchemaName,
    useSchema,
    useSchemaSectionHandleOrThrow,
} from '../../../lib'
import { WebLocale } from '../../../types/generated'
import { LoadingSpinner } from '../../loading/LoadingSpinner'
import TranslatableFields from './TranslatableFields'
import style from './translation.module.css'
import {
    transformFormValues,
    useInitialFieldsAndValues,
    useBaseReferenceValues,
} from './translationFormHooks'

type TranslationValues = Record<string, string>

type Locale = string
export type TranslationFormValues = Record<Locale, TranslationValues>

const availableTranslateableFields = [
    'name',
    'shortName',
    'formName',
    'description',
]

/**
 *  Get the translateable fields for schemaa.
 * Not every models has all the availableTranslateable fields,
 * so we need to filter based on the schema.
 * This also controls the order of the rendered fields */

export const getTranslateableFieldsForSchema = (schema: Schema) => {
    return availableTranslateableFields.filter(
        (field) => schema.properties[field]?.translatable
    )
}

export const TranslationForm = ({
    model,
    selectedLocale,
    onClose,
    schemaName,
}: {
    model: BaseListModel
    selectedLocale?: WebLocale | undefined
    onClose: () => void
    schemaName?: SchemaName
}) => {
    const engine = useDataEngine()
    const section = useSchemaSectionHandleOrThrow()
    const schemaNameOrDefaultSchemaName = schemaName ?? section.name
    const schema = useSchema(schemaNameOrDefaultSchemaName)

    const { show } = useAlert(
        ({ message }) => message,
        ({ isSuccess }) => (isSuccess ? { success: true } : { critical: true })
    )

    console.log('schema', schema)
    const translatableFields = getTranslateableFieldsForSchema(schema)
    console.log('translatableFields', translatableFields)

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
                    <TranslatableFields
                        translatableFields={translatableFields}
                        baseReferenceValues={baseReferenceValues}
                        selectedLocale={selectedLocale}
                    />
                    <div className={style.notice}>
                        {submitError && (
                            <NoticeBox error>{submitError}</NoticeBox>
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
                            dataTest="submit-translations-button"
                        >
                            {i18n.t('Save translations')}
                        </Button>
                    </ButtonStrip>
                </form>
            )}
        </Form>
    )
}
