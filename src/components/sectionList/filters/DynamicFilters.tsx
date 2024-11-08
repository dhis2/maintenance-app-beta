import React from 'react'
import { ConfigurableFilterKey } from './../../../lib'
import {
    AggregationTypeFilter,
    CategoryComboFilter,
    Categoryfilter,
    CategoryOptionFilter,
    CategoryOptionGroupFilter,
    DataDimensionTypeFilter,
    DataSetFilter,
    DomainTypeSelectionFilter,
    IgnoreApprovalFilter,
    PublicAccessFilter,
    ValueTypeSelectionFilter,
    FormTypeFilter,
} from './filterSelectors'
import { useFilterKeys } from './useFilterKeys'

type FilterKeyToComponentMap = Partial<Record<ConfigurableFilterKey, React.FC>>

const filterKeyToComponentMap: FilterKeyToComponentMap = {
    category: Categoryfilter,
    formType: FormTypeFilter,
    categoryOption: CategoryOptionFilter,
    categoryCombo: CategoryComboFilter,
    categoryOptionGroup: CategoryOptionGroupFilter,
    dataSet: DataSetFilter,
    domainType: DomainTypeSelectionFilter,
    valueType: ValueTypeSelectionFilter,
    aggregationType: AggregationTypeFilter,
    publicAccess: PublicAccessFilter,
    dataDimensionType: DataDimensionTypeFilter,
    ignoreApproval: IgnoreApprovalFilter,
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
