import { useDataQuery } from '@dhis2/app-runtime'
import { useState, Dispatch, SetStateAction } from 'react'
import { BaseListModel, useSchemaFromHandle } from '../../../lib'
import { camelCaseToConstantCase } from '../../../lib/utils'
import { Query, WrapQueryResponse } from '../../../types'
import {
    WebLocale,
    Translation,
    BaseIdentifiableObject,
    DataElement,
} from '../../../types/generated'

type DBLocalesResponse = WrapQueryResponse<WebLocale[]>
export interface TranslationType {
    locale: string
    property: string
    value: string
}
export interface FormObj {
    DESCRIPTION: string | undefined
    FORM_NAME: string | undefined
    NAME: string | undefined
    SHORT_NAME: string | undefined
}

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
const translateableFields = [
    'name',
    'shortName',
    'description',
    'formName',
] as const
type BaseReferenceValues = {
    name?: string
    shortName?: string
    description?: string
    formName?: string
}

export const useBaseReferenceValues = ({
    modelId,
    translatableFields,
}: {
    modelId: string
    translatableFields: string[]
}) => {
    const schema = useSchemaFromHandle()
    const [query] = useState(() => ({
        result: {
            resource: `${schema.plural}`,
            id: `${modelId}`,
            params: {
                fields: translatableFields,
            },
        },
    }))

    const queryResult =
        useDataQuery<WrapQueryResponse<Record<string, string>>>(query)

    return {
        ...queryResult,
        data: queryResult.data?.result,
    }
}

export const useLocales = (modelId: string) => {
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

export const useInitialFieldsAndValues = (
    model: BaseListModel,
    selectedLocale?: WebLocale
) => {
    const schema = useSchemaFromHandle()
    const { data: translations } = useLocales(model.id)

    if (!translations || !selectedLocale) {
        return undefined
    }

    const fieldsWithValues = translations.translations
        .filter((translation) => {
            return translation.locale === selectedLocale.locale
        })
        .reduce((acc, translation) => {
            acc[translation.property] = translation.value
            return acc
        }, {} as Record<string, string>)

    const allFieldsWithValues = Object.values(schema.properties)
        .filter((field) => field.translatable)
        .map((field) => camelCaseToConstantCase(field.name))
        .reduce((acc, fieldName) => {
            acc[fieldName] = fieldsWithValues[fieldName] || ''
            return acc
        }, {} as Record<string, string>)
    return allFieldsWithValues
}

// Function to transform form values
export const transformFormValues = (
    formValues: FormObj,
    selectedLocale: WebLocale
) => {
    const translations = Object.entries(formValues).map(
        ([key, value]: [string, string]) => {
            return {
                locale: selectedLocale.locale,
                property: key,
                value: value,
            }
        }
    )

    return translations
}

/**
 * Save last selected locale in local storage
 * Most of the time the same user will be translating the same locale,
 * so this is a quite useful quality of life feature
 * @returns [selectedLocaleString, setSelectedLocaleString]
 */
export const useLastSelectedLocale = () => {
    const localStorageKey = 'translationDialog_lastSelectedLocale'
    const [selectedLocaleString, setLocaleString] = useState<string>(
        () => localStorage.getItem(localStorageKey) || ''
    )

    const setSelectedLocaleString: Dispatch<SetStateAction<string>> = (
        action
    ) => {
        return setLocaleString((prev) => {
            const resolved =
                typeof action === 'function' ? action(prev) : action
            localStorage.setItem(localStorageKey, resolved)
            return resolved
        })
    }

    return [selectedLocaleString, setSelectedLocaleString] as const
}
