import i18n from '@dhis2/d2-i18n'
import { Input } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { useDebounce } from '../../../lib'
import { InputOnChangeObject } from '../../../types'
import css from './Filters.module.css'
import { IDENTIFIABLE_KEY, useSectionListFilter } from './useSectionListFilter'

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
                onChange={(value: InputOnChangeObject) => setValue(value.value)}
                value={value}
                dense
            />
        </>
    )
}
