import {
    CircularLoader,
    Input,
    SingleSelect,
    SingleSelectOption,
} from '@dhis2/ui'
import React, { useCallback, useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

interface Option {
    value: string
    label: string
}

type OnChange = ({ selected }: { selected: string }) => void
type OnFilterChange = ({ value }: { value: string }) => void
type OnIntersectionChange = ({
    isIntersecting,
}: {
    isIntersecting: boolean
}) => void
interface SearchableSingleSelectPropTypes {
    onChange: OnChange
    onFilterChange: OnFilterChange
    onIntersectionChange: OnIntersectionChange
    options: Option[]
    preventIntersectionDetection: boolean
    selected?: string
    showEndLoader: boolean
}

export const SearchableSingleSelect = ({
    onChange,
    onFilterChange,
    onIntersectionChange,
    options,
    preventIntersectionDetection,
    selected,
    showEndLoader,
}: SearchableSingleSelectPropTypes) => {
    const [currentlyIntersecting, setCurrentlyIntersecting] = useState(false)
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
        if (loadingSpinnerRef && !preventIntersectionDetection) {
            const observer = new IntersectionObserver(
                (entries) => {
                    const [{ isIntersecting }] = entries

                    if (isIntersecting !== currentlyIntersecting) {
                        setCurrentlyIntersecting(isIntersecting)
                        onIntersectionChange({ isIntersecting })
                    }
                },
                { threshold: 0.8 }
            )

            observer.observe(loadingSpinnerRef)
            return () => observer.disconnect()
        }
    }, [
        loadingSpinnerRef,
        currentlyIntersecting,
        preventIntersectionDetection,
        onIntersectionChange,
    ])

    return (
        <SingleSelect selected={selected} onChange={onChange}>
            <div
                style={{
                    position: 'sticky',
                    top: '0',
                    padding: 16,
                    boxShadow: '0 0 4px rgba(0,0,0,0.4)',
                    background: 'white',
                }}
            >
                <Input
                    dense
                    value={filterValue}
                    onChange={({ value }: { value: string }) =>
                        setFilterValue(value)
                    }
                />
            </div>

            {options.map(({ value, label }) => (
                <SingleSelectOption key={value} value={value} label={label} />
            ))}

            {showEndLoader && (
                <div
                    ref={(ref) => {
                        if (!!ref && ref !== loadingSpinnerRef) {
                            setLoadingSpinnerRef(ref)
                        }
                    }}
                    style={{
                        height: 80,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: 20,
                        overflow: 'hidden',
                    }}
                >
                    <CircularLoader />
                </div>
            )}
        </SingleSelect>
    )
}
