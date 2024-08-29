import React from 'react'
import { ConfigurableFilterKey } from './../../../lib'
import {
    AggregationTypeFilter,
    CategoryComboFilter,
    DataSetFilter,
    DomainTypeSelectionFilter,
    ValueTypeSelectionFilter,
    PublicAccessFilter,
    DataDimensionTypeFilter,
    Categoryfilter,
    CategoryOptionGroupFilter,
} from './filterSelectors'
import { useFilterKeys } from './useFilterKeys'

type FilterKeyToComponentMap = Partial<Record<ConfigurableFilterKey, React.FC>>

const filterKeyToComponentMap: FilterKeyToComponentMap = {
    category: Categoryfilter,
    categoryCombo: CategoryComboFilter,
    categoryOptionGroup: CategoryOptionGroupFilter,
    dataSet: DataSetFilter,
    domainType: DomainTypeSelectionFilter,
    valueType: ValueTypeSelectionFilter,
    aggregationType: AggregationTypeFilter,
    publicAccess: PublicAccessFilter,
    dataDimensionType: DataDimensionTypeFilter,
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
