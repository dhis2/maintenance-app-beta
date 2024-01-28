import { useMemo } from 'react'
import {
    useSectionListFilters,
    ParsedFilterParams,
    ConfigurableFilterKey,
    IDENTIFIABLE_KEY,
} from '../../../lib'
import { useModelListView } from '../listView'

export type FiltersWithValue = {
    [FilterKey in ConfigurableFilterKey]: {
        value: ParsedFilterParams[FilterKey]
        label: string
        filterKey: FilterKey
    }
}

export const useFilterKeys = () => {
    const [filters] = useSectionListFilters()
    const { filters: viewFilters } = useModelListView()
    // combine filters and views, since filters in URL might not be selected for view
    // but we should show them when they have a value
    const filterKeys = useMemo(() => {
        const viewFilterKeys = viewFilters.map(({ filterKey }) => filterKey)
        const selectedFiltersNotInView = Object.entries(filters)
            .filter(
                ([filterKey, value]) =>
                    value !== undefined &&
                    filterKey !== IDENTIFIABLE_KEY &&
                    !viewFilterKeys.includes(filterKey as ConfigurableFilterKey)
            )
            .map(([filterKey]) => filterKey) as ConfigurableFilterKey[]

        return viewFilterKeys.concat(selectedFiltersNotInView)
    }, [filters, viewFilters])
    return filterKeys
}
