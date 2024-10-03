import React from 'react'
import {
    AGGREGATION_TYPE,
    DATA_DIMENSION_TYPE,
    DOMAIN_TYPE,
    getTranslatedProperty,
    VALUE_TYPE,
} from '../../../../lib'
import { ConstantSelectionFilter } from './ConstantSelectionFilter'

export const DomainTypeSelectionFilter = () => {
    return (
        <ConstantSelectionFilter
            label={getTranslatedProperty('domainType')}
            filterKey="domainType"
            constants={DOMAIN_TYPE}
        />
    )
}

export const ValueTypeSelectionFilter = () => {
    return (
        <ConstantSelectionFilter
            label={getTranslatedProperty('valueType')}
            filterKey="valueType"
            constants={VALUE_TYPE}
            filterable
        />
    )
}

export const AggregationTypeFilter = () => {
    return (
        <ConstantSelectionFilter
            label={getTranslatedProperty('aggregationType')}
            filterKey="aggregationType"
            constants={AGGREGATION_TYPE}
            filterable
        />
    )
}

export const DataDimensionTypeFilter = () => {
    return (
        <ConstantSelectionFilter
            label={getTranslatedProperty('dataDimensionType')}
            filterKey="dataDimensionType"
            constants={DATA_DIMENSION_TYPE}
        />
    )
}
