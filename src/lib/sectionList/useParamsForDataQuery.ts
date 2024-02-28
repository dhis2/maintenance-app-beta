import { useMemo } from 'react'
import { useFilterQueryParams } from './filters'
import { usePaginationQueryParams } from './usePaginationParams'

export const useParamsForDataQuery = () => {
    const [paginationParams] = usePaginationQueryParams()
    const filterParams = useFilterQueryParams()

    return useMemo(() => {
        return {
            ...paginationParams,
            filter: filterParams,
        }
    }, [paginationParams, filterParams])
}
