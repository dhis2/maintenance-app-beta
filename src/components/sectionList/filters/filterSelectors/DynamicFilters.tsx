import React from 'react'
import { ConfigurableFilterKey } from '../../../../lib'
import { useFilterKeys } from '../useFilterKeys'
import {
    AggregationTypeFilter,
    CategoryComboFilter,
    Categoryfilter,
    CategoryOptionFilter,
    CategoryOptionGroupFilter,
    DataDimensionTypeFilter,
    IndicatorFilter,
    DomainTypeSelectionFilter,
    IgnoreApprovalFilter,
    PublicAccessFilter,
    ValueTypeSelectionFilter,
    FormTypeFilter,
    DataSetFilter,
} from '.'

type FilterKeyToComponentMap = Partial<Record<ConfigurableFilterKey, React.FC>>

const filterKeyToComponentMap: FilterKeyToComponentMap = {
    category: Categoryfilter,
    formType: FormTypeFilter,
    indicatorType: IndicatorFilter,
    categoryOption: CategoryOptionFilter,
    categoryCombo: CategoryComboFilter,
    categoryOptionGroup: CategoryOptionGroupFilter,
    domainType: DomainTypeSelectionFilter,
    valueType: ValueTypeSelectionFilter,
    aggregationType: AggregationTypeFilter,
    publicAccess: PublicAccessFilter,
    dataDimensionType: DataDimensionTypeFilter,
    ignoreApproval: IgnoreApprovalFilter,
    dataSet: DataSetFilter,
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
