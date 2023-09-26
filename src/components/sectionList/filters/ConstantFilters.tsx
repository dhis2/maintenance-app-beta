import React from 'react'
import { DOMAIN_TYPE, VALUE_TYPE } from '../../../lib'
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
