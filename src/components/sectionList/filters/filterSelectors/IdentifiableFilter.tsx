import i18n from '@dhis2/d2-i18n'
import { Input, InputEventPayload } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import {
    useDebounce,
    IDENTIFIABLE_KEY,
    useSectionListFilter,
} from '../../../../lib'
import css from './Filters.module.css'

export const IdentifiableFilter = () => {
    const [filter, setFilter] = useSectionListFilter(IDENTIFIABLE_KEY)
    const [value, setValue] = useState(filter || '')
    const debouncedValue = useDebounce<typeof filter>(value, 200)

    useEffect(() => {
        setFilter(debouncedValue || undefined) // convert empty string to undefined
    }, [debouncedValue, setFilter])

    useEffect(() => {
        if (!filter) {
            setValue('')
        }
    }, [filter])

    return (
        <>
            <Input
                className={css.identifiableSelectionFilter}
                placeholder={i18n.t('Search by name, code or ID')}
                onChange={(value: InputEventPayload) =>
                    setValue(value.value ?? '')
                }
                value={value}
                dataTest="input-search-name"
                dense
            />
        </>
    )
}
