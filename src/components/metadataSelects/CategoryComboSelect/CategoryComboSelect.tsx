import React, { useCallback, useRef, useState } from 'react'
import { SelectOption } from '../../../types'
import { SearchableSingleSelect } from '../../SearchableSingleSelect'
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
        return [...options, selectedOption]
    }

    return options
}

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
    const pageRef = useRef(0)

    // We need to persist the selected option so we can display an <Option />
    // when the current list doesn't contain the selected option (e.g. when
    // the page with the selected option hasn't been reached yet or when
    // filtering)
    const [selectedOption, setSelectedOption] = useState<SelectOption>()

    const optionsQuery = useOptionsQuery()
    const initialOptionQuery = useInitialOptionQuery({
        selected,
        onComplete: setSelectedOption,
    })

    const { refetch, data } = optionsQuery
    const pager = data?.pager
    const page = pager?.page || 0
    const pageCount = pager?.pageCount || 0

    const adjustQueryParamsWithChangedFilter = useCallback(
        ({ value }: { value: string }) => {
            const nextFilter = value ? `name:ilike:${value}` : ''
            filterRef.current = nextFilter
            refetch({ page: 0, filter: nextFilter })
        },
        [refetch]
    )

    const incrementPage = useCallback(
        () => refetch({ page: page + 1, filter: filterRef.current }),
        [refetch, page]
    )

    const loading = optionsQuery.loading || initialOptionQuery.loading
    const error =
        optionsQuery.error || initialOptionQuery.error
            ? // @TODO: Ask Joe what do do here!
              'An error has occurred. Please try again'
            : ''

    const displayOptions = computeDisplayOptions({
        selected,
        selectedOption,
        options: data?.result,
    })

    return (
        <SearchableSingleSelect
            onChange={({ selected }) => {
                const option = data.result.find(
                    ({ value }) => value === selected
                )
                setSelectedOption(option)
                onChange({ selected })
            }}
            onEndReached={incrementPage}
            options={displayOptions}
            selected={selected}
            showEndLoader={!loading && page < pageCount}
            onFilterChange={adjustQueryParamsWithChangedFilter}
            loading={loading}
            error={error}
            onRetryClick={() => {
                refetch({
                    pageSize: pageRef.current,
                    filter: filterRef.current,
                })
            }}
        />
    )
}
