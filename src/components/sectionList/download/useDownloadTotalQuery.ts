import { useDataEngine } from '@dhis2/app-runtime'
import { useQuery } from 'react-query'
import {
    useFilterQueryParams,
    useSchemaSectionHandleOrThrow,
} from '../../../lib'
import { createBoundQueryFn } from '../../../lib/query'
import { Pager } from '../../../types/generated'

const defaultOptions = {
    withFilters: false,
    enabled: true,
}
type UseDownloadTotalQueryOptions = {
    withFilters?: boolean
    enabled?: boolean
}

export const useDownloadTotalQuery = (
    options: UseDownloadTotalQueryOptions
) => {
    const mergedOptions = { ...defaultOptions, ...options }
    const dataEngine = useDataEngine()
    const section = useSchemaSectionHandleOrThrow()
    const selectedFilters = useFilterQueryParams()

    const query = {
        total: {
            resource: `${section.namePlural}.json`,
            params: {
                ...((mergedOptions.withFilters && {
                    filter: selectedFilters,
                }) ||
                    undefined),
                pageSize: 1,
                fields: 'id',
            },
        },
    }
    // only used to get total number of selected fields
    return useQuery({
        queryFn: createBoundQueryFn<{ total: { pager: Pager } }>(dataEngine),
        queryKey: [query],
        staleTime: 5000,
        select: (data) => data.total.pager.total,
        enabled: mergedOptions.enabled,
    })
}
