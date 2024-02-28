import { useMemo } from 'react'
import { useModelSectionHandleOrThrow } from '../routeUtils'
import { useSectionListFilters } from './filters'
import { parseFiltersToQueryParams } from './filters/parseFiltersToQueryParams'
import { usePaginationQueryParams } from './usePaginationParams'

export const useFilterQueryParams = (): string[] => {
    const [filters] = useSectionListFilters()
    const section = useModelSectionHandleOrThrow()

    return useMemo(() => {
        return parseFiltersToQueryParams(filters, section)
    }, [filters, section])
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
