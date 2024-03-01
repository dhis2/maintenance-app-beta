import React from 'react'
import { AGGREGATION_TYPE, DOMAIN_TYPE, VALUE_TYPE } from '../../../../lib'
import { ConstantSelectionFilter } from './ConstantSelectionFilter'

export const DomainTypeSelectionFilter = () => {
    return (
        <ConstantSelectionFilter
            label={'Domain type'}
            filterKey="domainType"
            constants={DOMAIN_TYPE}
        />
    )
}

export const ValueTypeSelectionFilter = () => {
    return (
        <ConstantSelectionFilter
            label={'Value type'}
            filterKey="valueType"
            constants={VALUE_TYPE}
            filterable
        />
    )
}

export const AggregationTypeFilter = () => {
    return (
        <ConstantSelectionFilter
            label={'Aggregation type'}
            filterKey="aggregationType"
            constants={AGGREGATION_TYPE}
            filterable
        />
    )
}
