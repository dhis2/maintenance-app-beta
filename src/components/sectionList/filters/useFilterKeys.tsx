import { useMemo } from 'react'
import {
    useSectionListFilters,
    ConfigurableFilterKey,
    IDENTIFIABLE_FILTER_KEY,
} from '../../../lib'
import { useModelListView } from '../listView'

/**
 * Get the filterKeys for for which filters to show.
 * This depends on the current "modelList" view, and selected filters with values in the url */
export const useFilterKeys = () => {
    const [filters] = useSectionListFilters()
    const { filters: viewFilters } = useModelListView()
    // combine filters and views, since filters in URL might not be selected for view
    // but we should show them when they have a value
    const filterKeys = useMemo(() => {
        const selectedFiltersNotInView = Object.entries(filters)
            .filter(
                ([filterKey, value]) =>
                    value !== undefined &&
                    filterKey !== IDENTIFIABLE_FILTER_KEY &&
                    !viewFilters.includes(filterKey as ConfigurableFilterKey)
            )
            .map(([filterKey]) => filterKey) as ConfigurableFilterKey[]

        return viewFilters.concat(selectedFiltersNotInView)
    }, [filters, viewFilters])
    return filterKeys
}
