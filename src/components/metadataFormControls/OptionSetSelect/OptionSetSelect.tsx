import i18n from '@dhis2/d2-i18n'
import React, { forwardRef } from 'react'
import { useOptionSetsQuery } from '../../../lib'
import { ModelSingleSelectLegacy } from '../ModelSingleSelect'
import type { ModelSingleSelectLegacyProps } from '../ModelSingleSelect'
import { useInitialOptionQuery } from './useInitialOptionQuery'

type OptionSetSelectProps = Omit<
    ModelSingleSelectLegacyProps,
    'useInitialOptionQuery' | 'useOptionsQuery'
>

export const OptionSetSelect = forwardRef(function OptionSetSelect(
    {
        onChange,
        invalid,
        placeholder = i18n.t('Option set'),
        required,
        selected,
        showAllOption,
        onBlur,
        onFocus,
    }: OptionSetSelectProps,
    ref
) {
    return (
        <ModelSingleSelectLegacy
            ref={ref}
            required={required}
            invalid={invalid}
            useInitialOptionQuery={useInitialOptionQuery}
            useOptionsQuery={useOptionSetsQuery}
            placeholder={placeholder}
            showAllOption={showAllOption}
            onChange={onChange}
            selected={selected}
            onBlur={onBlur}
            onFocus={onFocus}
        />
    )
})
