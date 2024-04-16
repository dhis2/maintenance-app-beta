import React from 'react'
import {
    AggregationTypeFilter,
    CategoryComboFilter,
    DataSetFilter,
    DomainTypeSelectionFilter,
    ValueTypeSelectionFilter,
    PublicAccessFilter,
} from './filterSelectors'
import { useFilterKeys } from './useFilterKeys'

const filterKeyToComponentMap: Record<string, React.FC> = {
    categoryCombo: CategoryComboFilter,
    dataSet: DataSetFilter,
    domainType: DomainTypeSelectionFilter,
    valueType: ValueTypeSelectionFilter,
    aggregationType: AggregationTypeFilter,
    publicAccess: PublicAccessFilter,
}

export const DynamicFilters = () => {
    const filterKeys = useFilterKeys()
    return (
        <>
            {filterKeys.map((filterKey) => {
                const FilterComponent = filterKeyToComponentMap[filterKey]
                return FilterComponent ? (
                    <FilterComponent key={filterKey} />
                ) : null
            })}
        </>
    )
}
