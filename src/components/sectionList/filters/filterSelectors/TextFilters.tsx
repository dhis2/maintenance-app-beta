import i18n from '@dhis2/d2-i18n'
import { Input, InputEventPayload, InputProps } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { TextFilterKey, useSectionListFilter } from '../../../../lib'
import css from './Filters.module.css'

export type TextFilterProps = {
    filterName: TextFilterKey
} & InputProps

export const TextFilter = ({ filterName, ...inputProps }: TextFilterProps) => {
    const [filter, setFilter] = useSectionListFilter(filterName)
    const [value, setValue] = useState(filter || '')

    const debouncedSetFilter = useDebouncedCallback(
        (debouncedFilter: string) =>
            // convert empty string to undefined
            // to prevent empty-value like in URL
            setFilter(debouncedFilter || undefined),
        200
    )

    const handleSetValue = (event: InputEventPayload) => {
        const eventValue = event.value ?? ''
        setValue(eventValue)
        debouncedSetFilter(eventValue)
    }

    useEffect(() => {
        // clear input-value when "Clear all filters"
        if (!filter) {
            setValue('')
        }
    }, [filter])

    return (
        <>
            <Input
                className={css.textFilter}
                placeholder={i18n.t('Search by form name')}
                onChange={handleSetValue}
                value={value}
                dataTest="input-search-name"
                dense
                {...inputProps}
            />
        </>
    )
}

export const FormNameFilter = () => {
    return <TextFilter filterName="formName" />
}
