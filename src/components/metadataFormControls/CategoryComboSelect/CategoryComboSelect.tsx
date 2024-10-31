import i18n from '@dhis2/d2-i18n'
import React, { forwardRef } from 'react'
import { ModelSingleSelect } from '../ModelSingleSelect/ModelSingleSelectRefactor'
import type { ModelSingleSelectProps } from '../ModelSingleSelect/ModelSingleSelectRefactor'
import { useInitialOptionQuery } from './useInitialOptionQuery'
import { useOptionsQuery } from './useOptionsQuery'
import { DisplayableModel } from '../../../types/models'

type CategoryComboSelectProps = ModelSingleSelectProps<DisplayableModel> & {
    required?: boolean
}
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
