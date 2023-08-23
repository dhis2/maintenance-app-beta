import React, { useCallback, useRef, useState } from 'react'
import { SelectOption } from '../../types'
import { SearchableSingleSelect } from '../SearchableSingleSelect'
import { useInitialOptionQuery } from './useInitialOptionQuery'
import { useOptionsQuery } from './useOptionsQuery'

function computeDisplayOptions({
    selected,
    selectedOption,
    options,
}: {
    options: SelectOption[]
    selected?: string
    selectedOption?: SelectOption
}): SelectOption[] {
    // This happens only when we haven't fetched the lable for an initially
    // selected value. Don't show anything to prevent error that an option is
    // missing
    if (!selectedOption && selected) {
        return []
    }

    const optionsContainSelected = options?.find(
        ({ value }) => value === selected
    )

    if (selectedOption && !optionsContainSelected) {
        return [...(options as SelectOption[]), selectedOption as SelectOption]
    }

    return options
}

const PAGE_SIZE = 10

export function CategoryComboSelect({
    onChange,
    selected,
}: {
    onChange: ({ selected }: { selected: string }) => void
    selected?: string
}) {
    // Using a ref because we don't want to react to changes.
    // We're using this value only when imperatively calling `refetch`,
    // nothing that depends on the render-cycle depends on this value
    const filterRef = useRef('')
    const pageSizeRef = useRef(PAGE_SIZE)

    // We need to persist the selected option so we can display an <Option />
    // when the current list doesn't contain the selected option (e.g. when
    // the page with the selected option hasn't been reached yet or when
    // filtering)
    const [selectedOption, setSelectedOption] = useState<SelectOption>()

    const { refetch: fetchInitialOption, ...initialOptionQuery } =
        useInitialOptionQuery({
            selected,
            onComplete: setSelectedOption,
        })

    const queryResult = useOptionsQuery({
        // the selected value will only be used when parsing the initial result,
        // and then never again, so there's no need to persist the first value
        initialSelected: selected,
        setSelectedOption,
        fetchInitialOption,
    })
    const { refetch, data } = queryResult
    const pager = data?.pager
    const page = pager?.page || 0
    const pageCount = pager?.pageCount || 0
    const pageSize = pager?.pageSize || 0
    const total = pager?.total || 0

    const adjustQueryParamsWithChangedFilter = useCallback(
        ({ value }: { value: string }) => {
            const nextFilter = value ? `name:ilike:${value}` : ''
            filterRef.current = nextFilter
            refetch({
                pageSize: nextFilter ? PAGE_SIZE : pageSizeRef.current,
                filter: nextFilter,
            })
        },
        [refetch]
    )

    const incrementPage = useCallback(
        ({ isIntersecting }: { isIntersecting: boolean }) => {
            if (!isIntersecting) {
                return false
            }

            pageSizeRef.current =
                pageSize >= total ? pageSize : pageSize + PAGE_SIZE

            refetch({
                pageSize: pageSizeRef.current,
                filter: filterRef.current,
            })
        },
        [refetch, pageSize, total]
    )

    const loading = queryResult.loading || initialOptionQuery.loading
    const error =
        queryResult.error || initialOptionQuery.error
            ? // @TODO: Ask Joe what do do here!
              'An error has occurred. Please try again'
            : ''

    const displayOptions = computeDisplayOptions({
        selected,
        selectedOption,
        options: data?.result,
    })

    // Initially we potentially have a selected value, but we might not have
    // fetched the corresponding label yet. Therefore we don't want to pass in
    // any value to the "selected" prop, as otherwise an error will be thrown
    const showSelected = !!displayOptions.find(
        ({ value }) => value === selected
    )

    return (
        <SearchableSingleSelect
            onChange={({ selected }) => {
                const option = data.result.find(
                    ({ value }) => value === selected
                )
                setSelectedOption(option)
                onChange({ selected })
            }}
            onIntersectionChange={incrementPage}
            options={displayOptions}
            preventIntersectionDetection={loading}
            selected={showSelected ? selected : ''}
            showEndLoader={!loading && page < pageCount}
            onFilterChange={adjustQueryParamsWithChangedFilter}
            loading={loading}
            error={error}
            onRetryClick={() => {
                refetch({
                    pageSize: pageSizeRef.current,
                    filter: filterRef.current,
                })
            }}
        />
    )
}
