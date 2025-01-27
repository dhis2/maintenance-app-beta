import i18n from '@dhis2/d2-i18n'
import { CheckboxField } from '@dhis2/ui'
import React from 'react'
import {
    BooleanFilterKey,
    getTranslatedProperty,
    useSectionListFilter,
} from '../../../../lib'

type BooleanFilterProps = {
    label: string
    filterKey: BooleanFilterKey
}

export const BooleanFilter = ({ filterKey, label }: BooleanFilterProps) => {
    const [filter, setFilter] = useSectionListFilter(filterKey)

    return (
        <CheckboxField
            checked={filter}
            name={filterKey}
            label={label}
            onChange={(payload) => setFilter(payload.checked)}
        />
    )
}

export const IgnoreApprovalFilter = () => {
    return (
        <BooleanFilter
            filterKey="ignoreApproval"
            label={getTranslatedProperty('ignoreApproval')}
        />
    )
}

export const CompulsoryFilter = () => {
    return (
        <BooleanFilter
            filterKey="compulsory"
            label={getTranslatedProperty('compulsory')}
        />
    )
}

export const DataDimensionFilter = () => {
    return (
        <BooleanFilter
            filterKey="dataDimension"
            label={getTranslatedProperty('dataDimension')}
        />
    )
}
