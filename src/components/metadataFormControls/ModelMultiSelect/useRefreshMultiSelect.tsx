import { useCallback } from 'react'
import { useQueryClient, InvalidateQueryFilters } from '@tanstack/react-query'
import { PlainResourceQuery } from '../../../types'

export const useRefreshModelMultiSelect = (
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
