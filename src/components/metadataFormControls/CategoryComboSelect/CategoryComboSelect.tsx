import i18n from '@dhis2/d2-i18n'
import React, { forwardRef } from 'react'
import { ModelSingleSelect } from '../ModelSingleSelect'
import { useInitialOptionQuery } from './useInitialOptionQuery'
import { useOptionsQuery } from './useOptionsQuery'

interface CategoryComboSelectProps {
    onChange: ({ selected }: { selected: string }) => void
    placeholder?: string
    selected?: string
    showAllOption?: boolean
    onBlur?: () => void
    onFocus?: () => void
}

export const CategoryComboSelect = forwardRef(function CategoryComboSelect(
    {
        onChange,
        placeholder = i18n.t('Category combo'),
        selected,
        showAllOption,
        onBlur,
        onFocus,
    }: CategoryComboSelectProps,
    ref
) {
    return (
        <ModelSingleSelect
            ref={ref}
            useInitialOptionQuery={useInitialOptionQuery}
            useOptionsQuery={useOptionsQuery}
            placeholder={placeholder}
            showAllOption={showAllOption}
            onChange={onChange}
            selected={selected}
            onBlur={onBlur}
            onFocus={onFocus}
        />
    )
})
