import { useDataQuery } from '@dhis2/app-runtime'
import { InputFieldFF } from '@dhis2/ui'
import React, { useState } from 'react'
import { Field, Form, useFormState } from 'react-final-form'
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

const { Field, Form: RFForm } = ReactFinalForm

type DBLocalesResponse = WrapQueryResponse<WebLocale[]>

export const useDBLocales = () => {
    const query = useDataQuery<DBLocalesResponse>({
        result: {
            resource: 'locales/db',
        },
    })

    return {
        ...query,
        data: query.data?.result,
    }
}

const useLocales = (modelId: string) => {
    const schema = useSchemaFromHandle()
    const [query] = useState<Query>(() => ({
        result: {
            resource: `${schema.plural}`,
            id: `${modelId}/translations`,
        },
    }))

    const queryResult =
        useDataQuery<WrapQueryResponse<{ translations: Translation[] }>>(query)

    return {
        ...queryResult,
        data: queryResult.data?.result,
    }
}

const useInitialValues = (model: BaseListModel, selectedLocale: WebLocale) => {
    const { data } = useLocales(model.id)
    const schema = useSchemaFromHandle()

    if (!data) {
        return undefined
    }

    const fieldsWithValues = data.translations
        .filter((translation) => translation.locale === selectedLocale.locale)
        .reduce((acc, translation) => {
            acc[translation.property] = translation.value
            return acc
        }, {} as Record<string, string>)

    const allFieldsWithValues = Object.values(schema.properties)
        .filter((field) => field.translatable)
        .map((field) => camelCaseToConstantCase(field.name))
        .reduce((acc, fieldName) => {
            acc[fieldName] = fieldsWithValues[fieldName]
            return acc
        }, {} as Record<string, string>)

    return allFieldsWithValues
}

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

    if (!initialValues) {
        return <LoadingSpinner />
    }
    return (
        <Form onSubmit={() => undefined} initialValues={initialValues}>
            {() => <TranslationFormFields />}
        </Form>
    )
}

export const TranslationFormFields = () => {
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
}
