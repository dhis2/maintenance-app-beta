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
    DataElementGroupFilter,
    DataElementGroupSetFilter,
    DataElementFilter,
    CompulsoryFilter,
    DataDimensionFilter,
} from '.'

type FilterKeyToComponentMap = Partial<Record<ConfigurableFilterKey, React.FC>>

const filterKeyToComponentMap: FilterKeyToComponentMap = {
    aggregationType: AggregationTypeFilter,
    category: Categoryfilter,
    categoryCombo: CategoryComboFilter,
    categoryOption: CategoryOptionFilter,
    categoryOptionGroup: CategoryOptionGroupFilter,
    compulsory: CompulsoryFilter,
    dataDimension: DataDimensionFilter,
    dataDimensionType: DataDimensionTypeFilter,
    dataElement: DataElementFilter,
    dataElementGroup: DataElementGroupFilter,
    dataElementGroupSet: DataElementGroupSetFilter,
    dataSet: DataSetFilter,
    domainType: DomainTypeSelectionFilter,
    formType: FormTypeFilter,
    ignoreApproval: IgnoreApprovalFilter,
    indicatorType: IndicatorFilter,
    publicAccess: PublicAccessFilter,
    valueType: ValueTypeSelectionFilter,
}

export const DynamicFilters = () => {
    const filterKeys = useFilterKeys()

    return (
        <span data-test="dynamic-filters">
            {filterKeys.map((filterKey) => {
                const FilterComponent = filterKeyToComponentMap[filterKey]
                return FilterComponent ? (
                    <FilterComponent key={filterKey} />
                ) : null
            })}
        </span>
    )
}
