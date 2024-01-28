import { useMemo } from 'react'
import { useSectionHandle } from './../../routeUtils/useSectionHandle'
import { parseFiltersToQueryParams } from './parseFiltersToQueryParams'
import { useSectionListFilters } from './useSectionListFilters'

export const useFilterQueryParams = (): string[] => {
    const [filters] = useSectionListFilters()
    const section = useSectionHandle()
    console.log({ section })
    return useMemo(() => {
        return parseFiltersToQueryParams(filters, section)
    }, [filters, section])
}
