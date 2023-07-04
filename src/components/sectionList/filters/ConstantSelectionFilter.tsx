import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQueryParam, ObjectParam } from 'use-query-params'
import css from './Filters.module.css'

type ConstantSelectionFilterProps = {
    filterKey: string
    label: string
    options: {
        label: string
        value: string
    }
}

export const ConstantSelectionFilter = ({
    label,
}: ConstantSelectionFilterProps) => {
    const [value, setValue] = React.useState('')
    const [filter, setFilter] = useQueryParam('filter', ObjectParam)

    return (
        <SingleSelect
            className={css.constantSelectionFilter}
            onChange={({ selected }) => {
                setFilter((prev) => ({ ...prev, domainType: selected }))
                console.log('selected', selected)
            }}
            selected={filter?.domainType || ''}
            placeholder={label}
        >
            <SingleSelectOption label="option one" value="1" />
            <SingleSelectOption label="option two" value="2" />
            <SingleSelectOption label="option three" value="3" />
        </SingleSelect>
    )
}
