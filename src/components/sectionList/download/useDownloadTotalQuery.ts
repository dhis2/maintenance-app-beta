import { useDataEngine } from '@dhis2/app-runtime'
import { useQuery } from 'react-query'
import { createBoundQueryFn } from '../../../lib/query'
import { Pager } from '../../../types/generated'

const defaultOptions = {
    enabled: true,
}
type UseDownloadTotalQueryOptions = {
    filters?: string[]
    enabled?: boolean
    modelNamePlural: string
}

export const useDownloadTotalQuery = (
    options: UseDownloadTotalQueryOptions
) => {
    const mergedOptions = { ...defaultOptions, ...options }
    const dataEngine = useDataEngine()

    const query = {
        total: {
            resource: `${mergedOptions.modelNamePlural}.json`,
            params: {
                ...(mergedOptions.filters && {
                    filter: mergedOptions.filters,
                }),
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
