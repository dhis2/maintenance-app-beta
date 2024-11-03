import i18n from '@dhis2/d2-i18n'
import {
    CircularLoader,
    Input,
    MultiSelect,
    MultiSelectOption,
    MultiSelectOptionProps,
    MultiSelectProps,
    SingleSelect,
    SingleSelectOption,
} from '@dhis2/ui'
import React, { forwardRef, useEffect, useState } from 'react'
import { useDebouncedState } from '../../lib'
import classes from './SearchableMultiSelect.module.css'

export interface Option {
    value: string
    label: string
}

const Loader = forwardRef<HTMLDivElement, object>(function Loader(_, ref) {
    return (
        <div ref={ref} className={classes.loader}>
            <CircularLoader />
        </div>
    )
})

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

type OwnProps = {
    onEndReached?: () => void
    onFilterChange: ({ value }: { value: string }) => void
    onRetryClick: () => void
    options: Array<{ value: string; label: string }>
    showEndLoader?: boolean
    error?: string
}

export type SearchableMultiSelectPropTypes = Omit<
    MultiSelectProps,
    keyof OwnProps
> &
    OwnProps
export const SearchableMultiSelect = ({
    disabled,
    error,
    dense,
    loading,
    placeholder,
    prefix,
    onBlur,
    onChange,
    onEndReached,
    onFilterChange,
    onFocus,
    onRetryClick,
    options,
    selected,
    showEndLoader,
}: SearchableMultiSelectPropTypes) => {
    const [loadingSpinnerRef, setLoadingSpinnerRef] = useState<HTMLElement>()

    const { liveValue: filter, setValue: setFilterValue } =
        useDebouncedState<string>({
            initialValue: '',
            onSetDebouncedValue: (value: string) => onFilterChange({ value }),
        })

    useEffect(() => {
        // We don't want to wait for intersections when loading as that can
        // cause buggy behavior
        if (loadingSpinnerRef && !loading) {
            const observer = new IntersectionObserver(
                (entries) => {
                    const [{ isIntersecting }] = entries

                    if (isIntersecting) {
                        onEndReached?.()
                    }
                },
                { threshold: 0.8 }
            )

            observer.observe(loadingSpinnerRef)
            return () => observer.disconnect()
        }
    }, [loadingSpinnerRef, loading, onEndReached])

    const hasSelectedInOptionList = !!options.find(
        ({ value }) => value === selected
    )

    return (
        <MultiSelect
            selected={selected}
            disabled={disabled}
            error={!!error}
            onChange={onChange}
            placeholder={placeholder}
            prefix={prefix}
            onBlur={onBlur}
            onFocus={onFocus}
            dense={dense}
            clearable={selected && selected.length > 1}
        >
            <div className={classes.searchField}>
                <div className={classes.searchInput}>
                    <Input
                        dense
                        initialFocus
                        value={filter}
                        onChange={({ value }) => setFilterValue(value ?? '')}
                        placeholder={i18n.t('Filter options')}
                    />
                </div>
                <button
                    className={classes.clearButton}
                    disabled={!filter}
                    onClick={() => setFilterValue('')}
                    type="button"
                >
                    clear
                </button>
            </div>

            {options.map(({ value, label }) => (
                <MultiSelectOption key={value} value={value} label={label} />
            ))}

            {!error && !loading && showEndLoader && (
                <Loader
                    ref={(ref) => {
                        if (!!ref && ref !== loadingSpinnerRef) {
                            setLoadingSpinnerRef(ref)
                        }
                    }}
                />
            )}

            {!error && loading && <Loader />}

            {error && <Error msg={error} onRetryClick={onRetryClick} />}
        </MultiSelect>
    )
}
