import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useEffect, useMemo, useState } from 'react'
import { SelectOption } from '../../../types'
import { CategoryCombo, Pager } from '../../../types/generated'

type CategoryComboQueryResult = {
    categoryCombos: {
        pager: Pager
        categoryCombos: CategoryCombo[]
    }
}

const CATEGORY_COMBOS_QUERY = {
    categoryCombos: {
        resource: 'categoryCombos',
        params: (variables: Record<string, string>) => {
            const params = {
                page: variables.page,
                pageSize: 10,
                fields: ['id', 'displayName', 'isDefault'],
                order: ['isDefault:desc', 'displayName'],
            }

            if (variables.filter) {
                return {
                    ...params,
                    filter: `name:ilike:${variables.filter}`,
                }
            }

            return params
        },
    },
}

export function useOptionsQuery() {
    const [loadedOptions, setLoadedOptions] = useState<SelectOption[]>([])
    // The gist doesn't include the `isDefault` value, need to use `useDataQuery`
    const queryResult = useDataQuery<CategoryComboQueryResult>(
        CATEGORY_COMBOS_QUERY,
        {
            variables: {
                page: 1,
                filter: '',
            },
        }
    )
    const { data } = queryResult

    // Must be done in `useEffect` and not in `onComplete`, as `onComplete`
    // won't get called when useDataQuery has the values in cache already
    useEffect(() => {
        if (data?.categoryCombos) {
            const { pager, categoryCombos } = data.categoryCombos
            // We want to add new options to existing ones so we don't have to
            // refetch existing options
            setLoadedOptions((prevLoadedOptions) => [
                // We only want to add when the current page is > 1
                ...(pager.page === 1 ? [] : prevLoadedOptions),
                ...(categoryCombos.map((catCombo) => {
                    const { id, displayName, isDefault } = catCombo
                    return {
                        value: id,
                        label: isDefault ? i18n.t('None') : displayName,
                    }
                }) || []),
            ])
        }
    }, [data])

    return useMemo(
        () => ({
            ...queryResult,
            data: {
                pager: queryResult.data?.categoryCombos.pager,
                result: loadedOptions,
            },
        }),
        [loadedOptions, queryResult]
    )
}