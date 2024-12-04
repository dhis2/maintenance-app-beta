import i18n from '@dhis2/d2-i18n'
import React, { forwardRef } from 'react'
import { ModelSingleSelect } from '../ModelSingleSelect'
import type { ModelSingleSelectProps } from '../ModelSingleSelect'
import { useCategoryCombosQuery } from './useCategoryCombosQuery'
import { useInitialCategoryComboQuery } from './useInitialCategoryComboQuery'

type CategoryComboSelectProps = Omit<
    ModelSingleSelectProps,
    'useInitialOptionQuery' | 'useOptionsQuery'
>

export const CategoryComboSelect = forwardRef(function CategoryComboSelect(
    {
        onChange,
        invalid,
        disabled,
        placeholder = i18n.t('Category combo'),
        required,
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
            required={required}
            invalid={invalid}
            disabled={disabled}
            useInitialOptionQuery={useInitialCategoryComboQuery}
            useOptionsQuery={useCategoryCombosQuery}
            placeholder={placeholder}
            showAllOption={showAllOption}
            onChange={onChange}
            selected={selected}
            onBlur={onBlur}
            onFocus={onFocus}
        />
    )
})
