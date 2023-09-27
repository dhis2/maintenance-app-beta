import i18n from '@dhis2/d2-i18n'
import {
    CircularLoader,
    Input,
    SingleSelect,
    SingleSelectOption,
} from '@dhis2/ui'
import React, { forwardRef, useCallback, useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import classes from './SearchableSingleSelect.module.css'

interface Option {
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

type OnChange = ({ selected }: { selected: string }) => void
type OnFilterChange = ({ value }: { value: string }) => void
interface SearchableSingleSelectPropTypes {
    onChange: OnChange
    onFilterChange: OnFilterChange
    onEndReached: () => void
    onRetryClick: () => void
    options: Option[]
    showEndLoader: boolean
    loading: boolean
    selected?: string
    error?: string
    showAllOption?: boolean
    label: string
}

export const SearchableSingleSelect = ({
    showAllOption,
    error,
    label,
    loading,
    onChange,
    onFilterChange,
    onEndReached,
    options,
    selected,
    showEndLoader,
    onRetryClick,
}: SearchableSingleSelectPropTypes) => {
    const [loadingSpinnerRef, setLoadingSpinnerRef] = useState<HTMLElement>()
    const debouncedOnFilterChange = useDebouncedCallback<OnFilterChange>(
        (args) => onFilterChange(args),
        200
    )

    // We want to defer the actual filter value so we don't send a request with
    // every key stroke
    const [filterValue, _setFilterValue] = useState('')
    const setFilterValue = useCallback(
        (nextFilterValue: string) => {
            _setFilterValue(nextFilterValue)
            debouncedOnFilterChange({ value: nextFilterValue })
        },
        [debouncedOnFilterChange]
    )

    useEffect(() => {
        // We don't want to wait for intersections when loading as that can
        // cause buggy behavior
        if (loadingSpinnerRef && !loading) {
            const observer = new IntersectionObserver(
                (entries) => {
                    const [{ isIntersecting }] = entries
                    if (isIntersecting) {
                        onEndReached()
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

    const withAllOptions = showAllOption
        ? [{ value: '', label: i18n.t('All') }, ...options]
        : options

    return (
        <SingleSelect
            // Initially we potentially have a selected value, but we might not have
            // fetched the corresponding label yet. Therefore we don't want to pass in
            // any value to the "selected" prop, as otherwise an error will be thrown
            selected={hasSelectedInOptionList ? selected : ''}
            onChange={onChange}
            placeholder={label}
        >
            <div className={classes.searchField}>
                <div className={classes.searchInput}>
                    <Input
                        dense
                        value={filterValue}
                        onChange={({ value }: { value: string }) =>
                            setFilterValue(value)
                        }
                    />
                </div>

                <button
                    className={classes.clearButton}
                    disabled={!filterValue}
                    onClick={() => setFilterValue('')}
                >
                    clear
                </button>
            </div>

            {withAllOptions.map(({ value, label }) => (
                <SingleSelectOption key={value} value={value} label={label} />
            ))}

            {hasSelectedInOptionList && (
                <SingleSelectOption
                    className={classes.invisibleOption}
                    value={selected}
                    label=""
                />
            )}

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
        </SingleSelect>
    )
}
