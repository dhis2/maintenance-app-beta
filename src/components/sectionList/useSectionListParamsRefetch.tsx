import { useEffect } from 'react'
import { QueryRefetchFunction } from '../../types'
import { useQueryParamsForModelGist } from './filters'

/** Refetches when filter and pagination params change  */
export const useSectionListParamsRefetch = (refetch: QueryRefetchFunction) => {
    const params = useQueryParamsForModelGist()

    useEffect(() => {
        refetch({
            ...params,
        })
    }, [refetch, params])
}
