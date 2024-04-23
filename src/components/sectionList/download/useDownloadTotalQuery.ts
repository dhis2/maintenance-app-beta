import { useDataEngine, useDataQuery } from '@dhis2/app-runtime'
import { useQuery } from 'react-query'
import {
    useParamsForDataQuery,
    useSchemaSectionHandleOrThrow,
} from '../../../lib'
import { createBoundQueryFn } from '../../../lib/query'
import { Pager } from '../../../types/generated'
import { useDownloadFormState } from './DownloadForm'

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
    const selectedParams = useParamsForDataQuery()

    const query = {
        total: {
            resource: `${section.namePlural}.json`,
            params: {
                ...((mergedOptions.withFilters && {
                    filter: selectedParams.filter,
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
