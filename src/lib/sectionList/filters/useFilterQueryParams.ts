import { useMemo } from 'react'
import { useModelSectionHandleOrThrow } from '../../routeUtils'
import { parseFiltersToQueryParams } from './parseFiltersToQueryParams'
import { useSectionListFilters } from './useSectionListFilters'

export const useFilterQueryParams = (): string[] => {
    const [filters] = useSectionListFilters()
    const section = useModelSectionHandleOrThrow()

    return useMemo(() => {
        return parseFiltersToQueryParams(filters, section)
    }, [filters, section])
}
