import { useQueryClient, InvalidateQueryFilters } from '@tanstack/react-query'
import { useCallback } from 'react'
import { PlainResourceQuery } from '../../../types'

export const useRefreshModelSingleSelect = (
    query: Omit<PlainResourceQuery, 'id'>
) => {
    const queryClient = useQueryClient()

    return useCallback(
        (invalidateFilters?: InvalidateQueryFilters) => {
            queryClient.invalidateQueries({
                queryKey: [query],
                ...invalidateFilters,
            })
        },
        [queryClient, query]
    )
}
