import { useDataQuery } from '@dhis2/app-runtime'
import { useMemo } from 'react'
import { OrganisationUnitLevel } from '../../../types/generated'

type AggregationLevelQueryResult = {
    aggregationLevels: {
        organisationUnitLevels: OrganisationUnitLevel[]
    }
}

const CATEGORY_COMBOS_QUERY = {
    aggregationLevels: {
        resource: 'organisationUnitLevels',
        params: {
            paging: false,
            fields: ['displayName', 'level'],
            order: ['displayName'],
            filter: 'name:ne:default',
        },
    },
}

export function useOptionsQuery() {
    const queryResult = useDataQuery<AggregationLevelQueryResult>(
        CATEGORY_COMBOS_QUERY
    )
    const { data } = queryResult

    return useMemo(() => {
        const aggregationLevels = data?.aggregationLevels.organisationUnitLevels
        const loadedOptions =
            aggregationLevels?.map(({ level, displayName }) => ({
                value: level,
                label: displayName,
            })) || []

        return {
            ...queryResult,
            data: { result: loadedOptions },
        }
    }, [data?.aggregationLevels.organisationUnitLevels, queryResult])
}
