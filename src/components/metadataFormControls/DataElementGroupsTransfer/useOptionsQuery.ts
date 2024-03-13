import { useDataQuery } from '@dhis2/app-runtime'
import { useEffect, useMemo, useState } from 'react'
import { SelectOption } from '../../../types'
import { DataElementGroup, Pager } from '../../../types/generated'

type DataElementGroupsQueryResult = {
    dataElementGroups: {
        pager: Pager
        dataElementGroups: DataElementGroup[]
    }
}

const CATEGORY_COMBOS_QUERY = {
    dataElementGroups: {
        resource: 'dataElementGroups',
        params: (variables: Record<string, string>) => {
            const params = {
                page: variables.page,
                pageSize: 10,
                fields: ['id', 'displayName'],
                order: ['displayName'],
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
    const queryResult = useDataQuery<DataElementGroupsQueryResult>(
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
        if (data?.dataElementGroups) {
            const { pager, dataElementGroups } = data.dataElementGroups
            // We want to add new options to existing ones so we don't have to
            // refetch existing options
            setLoadedOptions((prevLoadedOptions) => [
                // We only want to add when the current page is > 1
                ...(pager.page === 1 ? [] : prevLoadedOptions),
                ...(dataElementGroups.map((catCombo) => {
                    const { id, displayName } = catCombo
                    return { value: id, label: displayName }
                }) || []),
            ])
        }
    }, [data])

    return useMemo(
        () => ({
            ...queryResult,
            data: {
                pager: queryResult.data?.dataElementGroups.pager,
                result: loadedOptions,
            },
        }),
        [loadedOptions, queryResult]
    )
}
