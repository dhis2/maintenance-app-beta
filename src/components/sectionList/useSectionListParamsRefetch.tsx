import { useEffect } from 'react'
import { useFilterQueryParams } from '../../lib'
import { QueryRefetchFunction } from '../../types'

/** Refetches when filter and pagination params change  */
export const useSectionListParamsRefetch = (refetch: QueryRefetchFunction) => {
    const params = useFilterQueryParams()

    useEffect(() => {
        refetch({
            ...params,
        })
    }, [refetch, params])
}
