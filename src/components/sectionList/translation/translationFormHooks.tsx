import { useDataQuery } from '@dhis2/app-runtime'
import { useState, Dispatch, SetStateAction, useMemo } from 'react'
import { BaseListModel, useSchemaFromHandle } from '../../../lib'
import { camelCaseToConstantCase } from '../../../lib/utils'
import { Query, WrapQueryResponse } from '../../../types'
import { WebLocale, Translation } from '../../../types/generated'

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

export const initialFormObj: FormObj = {
    DESCRIPTION: "",
    FORM_NAME: "",
    NAME: "",
    SHORT_NAME: ""
};

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

export const useField = (modelId: string) => {
    const schema = useSchemaFromHandle()
    const [query] = useState(() => ({
        result: {
            resource: `${schema.plural}`,
            id: `${modelId}`,
            params: {
                fields: ['name', 'shortName', 'description', 'formName'],
            },
        },
    }))

    const queryResult =
        useDataQuery<WrapQueryResponse<{ translations: Translation[] }>>(query)

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
    const schema = useSchemaFromHandle();
    const { data } = useField(model.id);
    const { data: translations } = useLocales(model.id);

    if (!data || !translations) {
        return undefined;
    }

    if (!selectedLocale) {
        const initialFields = Object.entries(data || {}).reduce((obj: any, [key, value]) => {
            obj[camelCaseToConstantCase(key)] = value;
            return obj;
        }, {});

        const finalfields = Object.values(schema.properties)
            .filter((field) => field.translatable)
            .map((field) => camelCaseToConstantCase(field.name))
            .reduce((obj: any, key) => {
                obj[key] = initialFields.hasOwnProperty(key) ? initialFields[key] : '';
                return obj;
            }, {});

        return finalfields;
    }

    const fieldsWithValues = translations.translations
        .filter((translation) => {
            if (selectedLocale.locale === "en") {
                return translation.locale.startsWith("en")
            }
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

            acc[fieldName] = fieldsWithValues[fieldName] || '';
            return acc
        }, {} as Record<string, string>)
    return allFieldsWithValues;
};

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
