import i18n from '@dhis2/d2-i18n'
import { Box, Field, InputFieldFF, CheckboxFieldFF, NoticeBox } from '@dhis2/ui'
import React, { useMemo } from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { StandardFormField } from '../../../components'
import { SearchableMultiSelect } from '../../../components/SearchableMultiSelect'
import { SearchableSingleSelect } from '../../../components/SearchableSingleSelect'

// TODO: Set to true when version control is implemented (v43+)
const ENABLE_TRIGRAM_INDEXING = false

const PREFERRED_SEARCH_OPERATOR_OPTIONS = [
    { value: 'EQ', label: i18n.t('EQ / Equals') },
    { value: 'SW', label: i18n.t('SW / Starts with') },
    { value: 'EW', label: i18n.t('EW / Ends with') },
    { value: 'LIKE', label: i18n.t('LIKE / Contains') },
]

const BLOCKED_SEARCH_OPERATOR_OPTIONS = [
    { value: 'SW', label: i18n.t('SW / Starts with') },
    { value: 'EW', label: i18n.t('EW / Ends with') },
    { value: 'LIKE', label: i18n.t('LIKE / Contains') },
]

export function SearchPerformanceSection() {
    const { input: blockedOperatorsInput, meta: blockedOperatorsMeta } =
        useField<string[]>('blockedSearchOperators')
    const { input: preferredOperatorInput, meta: preferredOperatorMeta } =
        useField<string | undefined>('preferredSearchOperator')

    // Trigram indexing feature (v43+)
    const { input: trigramIndexableInput } = useField<boolean>(
        'trigramIndexable',
        { subscription: {} }
    )
    const { input: trigramIndexedInput } = useField<boolean | undefined>(
        'trigramIndexed',
        { subscription: {} }
    )

    const blockedOperators = blockedOperatorsInput.value || []
    const bothEwAndLikeBlocked =
        blockedOperators.includes('EW') && blockedOperators.includes('LIKE')

    // Disable and uncheck trigramIndexable if both EW and LIKE are blocked
    React.useEffect(() => {
        if (
            ENABLE_TRIGRAM_INDEXING &&
            bothEwAndLikeBlocked &&
            trigramIndexableInput.value
        ) {
            trigramIndexableInput.onChange(false)
        }
    }, [bothEwAndLikeBlocked, trigramIndexableInput])

    // Determine infobox message
    const infoboxMessage = useMemo(() => {
        if (!ENABLE_TRIGRAM_INDEXING || !trigramIndexableInput.value) {
            return null
        }

        return trigramIndexedInput.value === true
            ? i18n.t(
                  'This attribute is currently trigram indexed in the database'
              )
            : i18n.t(
                  'This attribute is currently not trigram indexed in the database'
              )
    }, [trigramIndexableInput.value, trigramIndexedInput.value])

    return (
        <>
            <StandardFormField>
                <Field
                    name="preferredSearchOperator"
                    label={i18n.t('Preferred search operator')}
                    helpText={i18n.t(
                        'Apps will try to use this recommended operator to improve performance, but can still use others if needed.'
                    )}
                    error={
                        preferredOperatorMeta.touched &&
                        preferredOperatorMeta.invalid
                    }
                    validationText={
                        preferredOperatorMeta.touched &&
                        preferredOperatorMeta.error
                            ? preferredOperatorMeta.error.toString()
                            : ''
                    }
                >
                    <Box width="400px" minWidth="100px">
                        <SearchableSingleSelect
                            dataTest="formfields-preferredSearchOperator"
                            selected={preferredOperatorInput.value || ''}
                            options={PREFERRED_SEARCH_OPERATOR_OPTIONS}
                            onChange={({ selected }) => {
                                preferredOperatorInput.onChange(
                                    selected || undefined
                                )
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
            </StandardFormField>

            <StandardFormField>
                <Field
                    name="blockedSearchOperators"
                    label={i18n.t('Blocked search operators')}
                    helpText={i18n.t(
                        'Searches with blocked search operators will return no results. This prevents inefficient searches.'
                    )}
                    error={
                        blockedOperatorsMeta.touched &&
                        blockedOperatorsMeta.invalid
                    }
                    validationText={
                        blockedOperatorsMeta.touched &&
                        blockedOperatorsMeta.error
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
            </StandardFormField>

            <StandardFormField>
                <FieldRFF
                    component={InputFieldFF}
                    inputWidth="200px"
                    name="minCharactersToSearch"
                    dataTest="formfields-minCharactersToSearch"
                    type="number"
                    min="0"
                    label={i18n.t('Minimum characters to search')}
                    helpText={i18n.t(
                        'Set the minimum characters required to start a search.'
                    )}
                    format={(value: unknown) =>
                        value !== undefined && value !== null
                            ? value.toString()
                            : ''
                    }
                    parse={(value: unknown) =>
                        value !== undefined && value !== '' && value !== null
                            ? Number.parseInt(value as string, 10)
                            : 0
                    }
                />
            </StandardFormField>

            {ENABLE_TRIGRAM_INDEXING && (
                <>
                    <StandardFormField>
                        <FieldRFF
                            component={CheckboxFieldFF}
                            dataTest="formfields-trigramIndexable"
                            name="trigramIndexable"
                            label={i18n.t('Mark for trigram indexing')}
                            helpText={i18n.t(
                                'Only relevant when using LIKE or EW based searches'
                            )}
                            type="checkbox"
                            disabled={bothEwAndLikeBlocked}
                            validateFields={[]}
                        />
                    </StandardFormField>

                    {infoboxMessage && (
                        <StandardFormField>
                            <NoticeBox>{infoboxMessage}</NoticeBox>
                        </StandardFormField>
                    )}
                </>
            )}
        </>
    )
}
