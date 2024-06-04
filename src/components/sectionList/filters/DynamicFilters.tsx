import React from 'react'
import { ConfigurableFilterKey } from './../../../lib'
import {
    AggregationTypeFilter,
    CategoryComboFilter,
    DataSetFilter,
    DomainTypeSelectionFilter,
    ValueTypeSelectionFilter,
    PublicAccessFilter,
    DataElementFilter,
    DataElementGroupFilter,
} from './filterSelectors'
import { useFilterKeys } from './useFilterKeys'

type FilterKeyToComponentMap = Partial<Record<ConfigurableFilterKey, React.FC>>

const filterKeyToComponentMap: FilterKeyToComponentMap = {
    categoryCombo: CategoryComboFilter,
    dataSet: DataSetFilter,
    dataElement: DataElementFilter,
    dataElementGroup: DataElementGroupFilter,
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
