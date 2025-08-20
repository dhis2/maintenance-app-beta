import i18n from '@dhis2/d2-i18n'
import { Input, InputEventPayload } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { useSectionListFilter } from '../../../../lib'
import css from './Filters.module.css'

export const FormNameFilter = () => {
    const [filter, setFilter] = useSectionListFilter('formName')
    const [value, setValue] = useState(filter || '')

    const debouncedSetFilter = useDebouncedCallback(
        (debouncedFilter: string) => setFilter(debouncedFilter || undefined),
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
                placeholder={i18n.t('Search by form name')}
                onChange={handleSetValue}
                value={value}
                dataTest="input-search-form-name"
                dense
            />
        </>
    )
}
