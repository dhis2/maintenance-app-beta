import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
import React from 'react'
import { SelectOnChangeObject } from '../../../types'
import css from './Filters.module.css'
import { useSectionListFilter } from './useSectionListFilter'

type ConstantSelectionFilterProps = {
    label: string
    constants: Record<string, string>
    filterKey: string
    filterable?: boolean
}

export const ConstantSelectionFilter = ({
    constants,
    filterKey,
    label,
    filterable,
}: ConstantSelectionFilterProps) => {
    const [filter, setFilter] = useSectionListFilter(filterKey)
    return (
        <SingleSelect
            className={css.constantSelectionFilter}
            onChange={({ selected }: SelectOnChangeObject) => {
                setFilter(selected)
            }}
            selected={filter}
            placeholder={label}
            dense
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
