import i18n from '@dhis2/d2-i18n'
import { Box, Field } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { useField } from 'react-final-form'
import { SearchableSingleSelect } from '../../../components'

const PREFERRED_SEARCH_OPERATOR_OPTIONS = [
    { value: 'EQ', label: i18n.t('EQ / Equals') },
    { value: 'SW', label: i18n.t('SW / Starts with') },
    { value: 'EW', label: i18n.t('EW / Ends with') },
    { value: 'LIKE', label: i18n.t('LIKE / Contains') },
]

export function PreferredSearchOperatorField() {
    const { input: preferredOperatorInput, meta: preferredOperatorMeta } =
        useField<string | undefined>('preferredSearchOperator')
    const { input: blockedOperatorsInput } = useField<string[]>(
        'blockedSearchOperators',
        { subscription: { value: true } }
    )

    // Mark blocked operators as disabled
    const availableOptions = React.useMemo(() => {
        const blockedOperators = blockedOperatorsInput.value || []
        return PREFERRED_SEARCH_OPERATOR_OPTIONS.map((option) => {
            const isBlocked = blockedOperators.includes(option.value)
            return {
                ...option,
                disabled: isBlocked,
                label: isBlocked
                    ? `${option.label} ${i18n.t('(blocked)')}`
                    : option.label,
            }
        })
    }, [blockedOperatorsInput.value])

    // Clear preferred operator if it becomes blocked
    useEffect(() => {
        const blockedOperators = blockedOperatorsInput.value || []
        if (
            preferredOperatorInput.value &&
            blockedOperators.includes(preferredOperatorInput.value)
        ) {
            preferredOperatorInput.onChange(undefined)
        }
        // preferredOperatorInput is excluded from deps because it's not a stable reference
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [blockedOperatorsInput.value, preferredOperatorInput.value])

    return (
        <Field
            name="preferredSearchOperator"
            label={i18n.t('Preferred search operator')}
            helpText={i18n.t(
                'Apps will try to use this recommended operator to improve performance, but can still use others if needed.'
            )}
            error={
                preferredOperatorMeta.touched && preferredOperatorMeta.invalid
            }
            validationText={
                preferredOperatorMeta.touched && preferredOperatorMeta.error
                    ? preferredOperatorMeta.error.toString()
                    : ''
            }
        >
            <Box width="400px" minWidth="100px">
                <SearchableSingleSelect
                    dataTest="formfields-preferredSearchOperator"
                    selected={preferredOperatorInput.value || ''}
                    options={availableOptions}
                    onChange={({ selected }: { selected: string }) => {
                        preferredOperatorInput.onChange(selected || undefined)
                    }}
                    onBlur={preferredOperatorInput.onBlur}
                    onFocus={preferredOperatorInput.onFocus}
                    loading={false}
                    showEndLoader={false}
                    onRetryClick={() => {}}
                    onFilterChange={() => {}}
                    invalid={
                        preferredOperatorMeta.touched &&
                        !!preferredOperatorMeta.error
                    }
                    clearable
                    clearText={i18n.t('<No value>')}
                />
            </Box>
        </Field>
    )
}
