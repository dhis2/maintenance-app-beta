import i18n from '@dhis2/d2-i18n'
import { Box, Field } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { SearchableMultiSelect } from '../../../components/SearchableMultiSelect'

const BLOCKED_SEARCH_OPERATOR_OPTIONS = [
    { value: 'SW', label: i18n.t('SW / Starts with') },
    { value: 'EW', label: i18n.t('EW / Ends with') },
    { value: 'LIKE', label: i18n.t('LIKE / Contains') },
]

export function BlockedSearchOperatorsField() {
    const { input: blockedOperatorsInput, meta: blockedOperatorsMeta } =
        useField<string[]>('blockedSearchOperators')

    return (
        <Field
            name="blockedSearchOperators"
            label={i18n.t('Blocked search operators')}
            helpText={i18n.t(
                'Searches with blocked search operators will return no results. This prevents inefficient searches.'
            )}
            error={blockedOperatorsMeta.touched && blockedOperatorsMeta.invalid}
            validationText={
                blockedOperatorsMeta.touched && blockedOperatorsMeta.error
                    ? blockedOperatorsMeta.error.toString()
                    : ''
            }
        >
            <Box width="400px" minWidth="100px">
                <SearchableMultiSelect
                    dataTest="formfields-blockedSearchOperators"
                    selected={blockedOperatorsInput.value || []}
                    options={BLOCKED_SEARCH_OPERATOR_OPTIONS}
                    onChange={({ selected }) => {
                        blockedOperatorsInput.onChange(selected)
                        blockedOperatorsInput.onBlur()
                    }}
                    onBlur={() => blockedOperatorsInput.onBlur()}
                    onFocus={() => blockedOperatorsInput.onFocus()}
                    loading={false}
                    showEndLoader={false}
                    onRetryClick={() => {}}
                    onFilterChange={() => {}}
                    error={
                        blockedOperatorsMeta.touched &&
                        blockedOperatorsMeta.error
                            ? blockedOperatorsMeta.error.toString()
                            : undefined
                    }
                />
            </Box>
        </Field>
    )
}
