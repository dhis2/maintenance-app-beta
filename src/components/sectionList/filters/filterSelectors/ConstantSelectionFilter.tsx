import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
import React from 'react'
import { FilterKey, useSectionListFilter } from '../../../../lib'
import { SelectOnChangeObject } from '../../../../types'
import css from './Filters.module.css'

type ConstantSelectionFilterProps = {
    label: string
    constants: Record<string, string>
    filterKey: FilterKey
    filterable?: boolean
    formatFilter?: (filter: string | undefined) => string | undefined
}

export const ConstantSelectionFilter = ({
    constants,
    filterKey,
    label,
    filterable,
    formatFilter,
}: ConstantSelectionFilterProps) => {
    const [filter, setFilter] = useSectionListFilter(filterKey)

    let selected = Array.isArray(filter) ? filter[0] : filter
    if (formatFilter) {
        selected = formatFilter(selected)
    }

    const isInOptions =
        selected && constants[selected as keyof typeof constants]

    return (
        <SingleSelect
            className={css.constantSelectionFilter}
            onChange={({ selected }: SelectOnChangeObject) => {
                setFilter(selected ? [selected] : undefined)
            }}
            selected={isInOptions ? selected : undefined}
            placeholder={label}
            dense
            prefix={label}
            filterable={filterable}
            filterPlaceholder={i18n.t('Type to filter options')}
            noMatchText={i18n.t('No matches')}
        >
            <SingleSelectOption key={'all'} label={'All'} value={''} />
            {Object.entries(constants).map(([key, label]) => (
                <SingleSelectOption key={key} label={label} value={key} />
            ))}
        </SingleSelect>
    )
}
