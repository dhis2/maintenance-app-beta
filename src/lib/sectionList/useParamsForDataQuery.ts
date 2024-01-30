import { useMemo } from 'react'
import { useFilterQueryParams } from './filters'
import { usePaginationQueryParams } from './usePaginationParams'
import { useSortOrderQueryParams } from './useSectionListSortOrder'

export const useParamsForDataQuery = () => {
    const [paginationParams] = usePaginationQueryParams()
    const filterParams = useFilterQueryParams()
    const sortOrderParams = useSortOrderQueryParams()

    return useMemo(() => {
        return {
            ...paginationParams,
            filter: filterParams,
            order: sortOrderParams,
        }
    }, [paginationParams, filterParams, sortOrderParams])
}
