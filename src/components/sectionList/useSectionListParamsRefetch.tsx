import { useEffect } from 'react'
import { QueryRefetchFunction } from '../../types'
import { useSectionListQueryFilter } from './filters'
import { usePaginationQueryParams } from './SectionListPagination'

/** Refetches when filter and pagination params change  */
export const useSectionListParamsRefetch = (refetch: QueryRefetchFunction) => {
    const { filter, rootJunction } = useSectionListQueryFilter()
    const [paginationParams] = usePaginationQueryParams()

    useEffect(() => {
        refetch({
            ...paginationParams,
            filter,
            rootJunction,
        })
    }, [refetch, paginationParams, filter, rootJunction])
}
