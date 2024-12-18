import i18n from '@dhis2/d2-i18n'
import React, { forwardRef } from 'react'
import { ModelSingleSelectLegacy } from '../ModelSingleSelect'
import type { ModelSingleSelectLegacyProps } from '../ModelSingleSelect'
import { useInitialOptionQuery } from './useInitialOptionQuery'
import { useOptionsQuery } from './useOptionsQuery'

type CategoryComboSelectProps = Omit<
    ModelSingleSelectLegacyProps,
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
        <ModelSingleSelectLegacy
            ref={ref}
            required={required}
            invalid={invalid}
            disabled={disabled}
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
