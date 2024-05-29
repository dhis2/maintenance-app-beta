import { useDataQuery } from '@dhis2/app-runtime'
import { useState, Dispatch, SetStateAction, useMemo } from 'react'
import { Query, WrapQueryResponse } from '../../../types'
import { WebLocale, Translation } from '../../../types/generated'
import { TranslationFormValues } from './TranslationForm'

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

export const useBaseReferenceValues = ({
    modelId,
    modelNamePlural,
    translatableFields,
}: {
    modelId: string
    modelNamePlural: string
    translatableFields: string[]
}) => {
    const [query] = useState(() => ({
        result: {
            resource: modelNamePlural,
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

export const useTranslations = ({
    modelId,
    modelNamePlural,
}: {
    modelId: string
    modelNamePlural: string
}) => {
    const [query] = useState<Query>(() => ({
        result: {
            resource: modelNamePlural,
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

export const useInitialFieldsAndValues = ({
    modelId,
    modelNamePlural,
}: {
    modelId: string
    modelNamePlural: string
}) => {
    const { data: translations } = useTranslations({ modelId, modelNamePlural })

    return useMemo(() => {
        if (!translations) {
            return undefined
        }
        return translations.translations.reduce((acc, translation) => {
            if (!acc[translation.locale]) {
                acc[translation.locale] = {
                    [translation.property]: translation.value,
                }
            } else {
                acc[translation.locale][translation.property] =
                    translation.value
            }
            return acc
        }, {} as TranslationFormValues)
    }, [translations])
}

// Function to transform form values
export const transformFormValues = (
    formValues: TranslationFormValues
): Translation[] => {
    const translations = Object.entries(formValues).flatMap(
        ([locale, valueObject]) => {
            return Object.entries(valueObject).map(([property, value]) => {
                return {
                    locale,
                    property,
                    value,
                }
            })
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
