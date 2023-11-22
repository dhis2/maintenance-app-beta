import i18n from '@dhis2/d2-i18n'
import { MultiSelect, MultiSelectField, MultiSelectOption } from '@dhis2/ui'
import React, { forwardRef, useImperativeHandle } from 'react'
import classes from './AggregationLevelMultiSelect.module.css'
import { useOptionsQuery } from './useOptionsQuery'

function Error({
    msg,
    onRetryClick,
}: {
    msg: string
    onRetryClick: () => void
}) {
    return (
        <div className={classes.error}>
            <div className={classes.errorInnerWrapper}>
                <span className={classes.loadingErrorLabel}>{msg}</span>
                <button
                    className={classes.errorRetryButton}
                    type="button"
                    onClick={onRetryClick}
                >
                    {i18n.t('Retry')}
                </button>
            </div>
        </div>
    )
}

interface AggregationLevelMultiSelectProps {
    onChange: ({ selected }: { selected: string[] }) => void
    onRetryClick: () => void
    inputWidth?: string
    invalid?: boolean
    placeholder?: string
    selected?: string[]
    showAllOption?: boolean
    onBlur?: () => void
    onFocus?: () => void
}

export const AggregationLevelMultiSelect = forwardRef(
    function AggregationLevelMultiSelect(
        {
            onChange,
            inputWidth,
            invalid,
            selected,
            showAllOption,
            placeholder = i18n.t('Aggregation level(s)'),
            onBlur,
            onFocus,
            onRetryClick,
        }: AggregationLevelMultiSelectProps,
        ref
    ) {
        const optionsQuery = useOptionsQuery()
        const { refetch } = optionsQuery

        useImperativeHandle(ref, () => ({ refetch }), [refetch])

        const displayOptions = optionsQuery.data?.result || []
        const loading = optionsQuery.fetching || optionsQuery.loading

        return (
            <MultiSelect
                placeholder={placeholder}
                onChange={({ selected }: { selected: string[] }) => {
                    onChange({ selected })
                }}
                error={!!optionsQuery.error || invalid}
                selected={loading ? [] : selected}
                loading={loading}
                onBlur={onBlur}
                onFocus={onFocus}
            >
                {showAllOption && (
                    <MultiSelectOption value="" label={i18n.t('All')} />
                )}

                {displayOptions.map(({ value, label }) => (
                    <MultiSelectOption
                        value={value.toString()}
                        label={label}
                        key={value}
                    />
                ))}

                {optionsQuery.error && (
                    <Error
                        msg={optionsQuery.error.toString()}
                        onRetryClick={onRetryClick}
                    />
                )}
            </MultiSelect>
        )
    }
)
