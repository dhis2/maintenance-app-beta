import i18n from '@dhis2/d2-i18n'
import { Input, InputEventPayload } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { IDENTIFIABLE_FILTER_KEY, useSectionListFilter } from '../../../../lib'
import css from './Filters.module.css'

export const IdentifiableFilter = () => {
    const [filter, setFilter] = useSectionListFilter(IDENTIFIABLE_FILTER_KEY)
    const [value, setValue] = useState(filter || '')

    const debouncedSetFilter = useDebouncedCallback(
        (debouncedFilter: string) =>
            // convert empty string to undefined
            // to prevent empty-value like "identifiable=" in URL
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
                className={css.identifiableSelectionFilter}
                placeholder={i18n.t('Search by name, code or ID')}
                onChange={handleSetValue}
                value={value}
                dataTest="input-search-name"
                dense
            />
        </>
    )
}
