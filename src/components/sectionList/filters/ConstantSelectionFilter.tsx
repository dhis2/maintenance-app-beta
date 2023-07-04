import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQueryParam, ObjectParam } from 'use-query-params'
import css from './Filters.module.css'

type ConstantSelectionFilterProps = {
    label: string
}

export const ConstantSelectionFilter = ({
    label,
}: ConstantSelectionFilterProps) => {
    const [value, setValue] = React.useState('')
    const [filter, setFilter] = useQueryParam('filter', ObjectParam)

    return (
        <SingleSelect
            className={css.constantSelectionFilter}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={({ selected }: any) => {
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
