import i18n from '@dhis2/d2-i18n'
import React, { forwardRef } from 'react'
import { ModelSingleSelect } from '../ModelSingleSelect'
import { useInitialOptionQuery } from './useInitialOptionQuery'
import { useOptionsQuery } from './useOptionsQuery'

interface OptionSetSelectProps {
    onChange: ({ selected }: { selected: string }) => void
    placeholder?: string
    selected?: string
    showAllOption?: boolean
    onBlur?: () => void
    onFocus?: () => void
}

export const OptionSetSelect = forwardRef(function OptionSetSelect(
    {
        onChange,
        placeholder = i18n.t('Option set'),
        selected,
        showAllOption,
        onBlur,
        onFocus,
    }: OptionSetSelectProps,
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
