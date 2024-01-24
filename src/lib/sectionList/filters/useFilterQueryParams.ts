import { useMemo } from 'react'
import {
    useModelSectionHandleOrThrow,
    useSectionHandle,
} from './../../routeUtils/useSectionHandle'
import { ParsedFilterParams } from './filtersQueryParamSimple'
import { parseFiltersToQueryParams } from './parseFiltersToQueryParams'
import { useSectionListFilters } from './useSectionListFilters'

export const useFilterQueryParams = (): string[] => {
    const [filters] = useSectionListFilters()
    const section = useSectionHandle()

    return useMemo(() => {
        return parseFiltersToQueryParams(filters, section)
    }, [filters, section])
}
