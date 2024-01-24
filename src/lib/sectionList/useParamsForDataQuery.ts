import { useMemo } from 'react'
import { useSectionListFilters } from './filters'
import { parseFiltersToQueryParams } from './filters/parseFiltersToQueryParams'
import { usePaginationQueryParams } from './usePaginationParams'

export const useFilterQueryParams = (): string[] => {
    const [filters] = useSectionListFilters()

    return useMemo(() => {
        return parseFiltersToQueryParams(filters)
    }, [filters])
}

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
