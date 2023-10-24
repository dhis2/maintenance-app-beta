import i18n from '@dhis2/d2-i18n'
import React, { forwardRef } from 'react'
import { ModelSingleSelect } from '../ModelSingleSelect'
import type { ModelSingleSelectProps } from '../ModelSingleSelect'
import { useInitialOptionQuery } from './useInitialOptionQuery'
import { useOptionsQuery } from './useOptionsQuery'

type CategoryComboSelectProps = Omit<
    ModelSingleSelectProps,
    'useInitialOptionQuery' | 'useOptionsQuery'
>

export const CategoryComboSelect = forwardRef(function CategoryComboSelect(
    {
        onChange,
        invalid,
        placeholder = i18n.t('Category combo'),
        prefix,
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
            useInitialOptionQuery={useInitialOptionQuery}
            useOptionsQuery={useOptionsQuery}
            placeholder={placeholder}
            prefix={prefix}
            showAllOption={showAllOption}
            onChange={onChange}
            selected={selected}
            onBlur={onBlur}
            onFocus={onFocus}
        />
    )
})
