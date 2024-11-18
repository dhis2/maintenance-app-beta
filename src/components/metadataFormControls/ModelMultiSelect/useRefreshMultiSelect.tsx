import { useCallback } from 'react'
import { useQueryClient, InvalidateQueryFilters } from 'react-query'
import { PlainResourceQuery } from '../../../types'

export const useRefreshModelSingleSelect = (
    query: Omit<PlainResourceQuery, 'id'>
) => {
    const queryClient = useQueryClient()

    return useCallback(
        (invalidateFilters?: InvalidateQueryFilters) => {
            console.log('invalidate', query)
            queryClient.invalidateQueries({
                queryKey: [query],
                // ...invalidateFilters,
            })
        },
        [queryClient, query]
    )
}
