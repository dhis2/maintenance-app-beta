import { useDataQuery } from '@dhis2/app-runtime'
import { useEffect, useMemo, useState } from 'react'
import { SelectOption } from '../../types'
import { OptionSet, Pager } from '../../types/generated'

type OptionSetQueryResult = {
    optionSets: {
        pager: Pager
        optionSets: OptionSet[]
    }
}

const OPTION_SETS_QUERY = {
    optionSets: {
        resource: 'optionSets',
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

export function useOptionSetsQuery() {
    const [loadedOptions, setLoadedOptions] = useState<SelectOption[]>([])
    const queryResult = useDataQuery<OptionSetQueryResult>(OPTION_SETS_QUERY, {
        variables: {
            page: 1,
            filter: '',
        },
    })
    const { data } = queryResult

    // Must be done in `useEffect` and not in `onComplete`, as `onComplete`
    // won't get called when useDataQuery has the values in cache already
    useEffect(() => {
        if (data?.optionSets) {
            const { pager, optionSets } = data.optionSets
            // We want to add new options to existing ones so we don't have to
            // refetch existing options
            setLoadedOptions((prevLoadedOptions) => [
                // We only want to add when the current page is > 1
                ...(pager.page === 1 ? [] : prevLoadedOptions),
                ...(optionSets.map((catCombo) => {
                    const { id, displayName } = catCombo
                    return { value: id, label: displayName }
                }) || []),
            ])
        }
    }, [data])

    return useMemo(() => {
        const pager = queryResult.data?.optionSets.pager
        const result = loadedOptions

        return {
            ...queryResult,
            data: { pager, result },
        }
    }, [loadedOptions, queryResult])
}
