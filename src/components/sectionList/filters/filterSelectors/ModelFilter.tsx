import { useDataQuery } from '@dhis2/app-runtime'
import React, { useCallback, useRef, useState } from 'react'
import { useInfiniteDataQuery } from '../../../../lib/query'
import type { ResultQuery } from '../../../../types'
import { Option, SearchableSingleSelect } from '../../../SearchableSingleSelect'

function computeDisplayOptions({
    selected,
    selectedOption,
    options,
}: {
    options: OptionResult[]
    selected?: string
    required?: boolean
    selectedOption?: OptionResult
}): Option[] {
    // This happens only when we haven't fetched the label for an initially
    // selected value. Don't show anything to prevent error that an option is
    // missing
    if (!selectedOption && selected) {
        return []
    }

    const optionsContainSelected = options?.find(({ id }) => id === selected)

    const withSelectedOption =
        selectedOption && !optionsContainSelected
            ? [...options, selectedOption]
            : options

    return withSelectedOption.map((option) => ({
        value: option.id,
        label: option.displayName,
    }))
}

type OptionResult = {
    id: string
    displayName: string
}

const createInitialOptionQuery = (
    resource: string,
    selected?: string
): ResultQuery => ({
    result: {
        resource: resource,
        id: selected,
        params: (params) => ({
            ...params,
            fields: ['id', 'displayName'],
        }),
    },
})

export interface ModelSingleSelectProps {
    onChange: ({ selected }: { selected: string | undefined }) => void
    selected?: string
    placeholder: string
    query: ResultQuery
}

export const ModelFilterSelect = ({
    onChange,
    selected,
    query,
    placeholder,
}: ModelSingleSelectProps) => {
    // Using a ref because we don't want to react to changes.
    // We're using this value only when imperatively calling `refetch`,
    // nothing that depends on the render-cycle depends on this value
    const filterRef = useRef<string | undefined>()

    const [initialQuery] = useState(() =>
        createInitialOptionQuery(query.result.resource, selected)
    )

    const initialOptionResult = useDataQuery<OptionResult>(initialQuery, {
        // run only when we have an initial selected value
        lazy: initialQuery.result.id === undefined,
        onComplete: (data) => {
            setSelectedOption(data)
        },
    })

    // We need to persist the selected option so we can display an <Option />
    // when the current list doesn't contain the selected option (e.g. when
    // the page with the selected option hasn't been reached yet or when
    // filtering)
    const [selectedOption, setSelectedOption] = useState<OptionResult>()
    const optionsQueryResult = useInfiniteDataQuery<OptionResult>(query)
    // const optionsQueryResult = useDataQuery<PagedResult>(query)
    const { refetch, data, incrementPage } = optionsQueryResult

    const pager = data?.result.pager
    const page = pager?.page || 0
    const pageCount = pager?.pageCount || 0

    const refetchWithFilter = useCallback(
        ({ value }: { value: string }) => {
            filterRef.current = value ? `displayName:ilike:${value}` : undefined
            refetch({
                page: 1,
                filter: filterRef.current,
            })
        },
        [refetch]
    )

    const loading =
        optionsQueryResult.fetching ||
        optionsQueryResult.loading ||
        initialOptionResult.loading
    const error =
        optionsQueryResult.error || initialOptionResult.error
            ? // @TODO: Ask Joe what do do here!
              'An error has occurred. Please try again'
            : ''
    const dataResultKey = query.result.resource
    const options = data?.result[dataResultKey] || []

    const displayOptions = computeDisplayOptions({
        selected,
        selectedOption,
        options,
    })

    return (
        <div style={{ minWidth: 200 }}>
            <SearchableSingleSelect
                dense
                placeholder={placeholder}
                prefix={placeholder}
                showAllOption={true}
                onChange={({ selected }) => {
                    if (selected === selectedOption?.id) {
                        setSelectedOption(undefined)
                    } else {
                        const option = options.find(({ id }) => id === selected)
                        setSelectedOption(option)
                    }

                    onChange({ selected: selected })
                }}
                onEndReached={incrementPage}
                options={displayOptions}
                selected={selected}
                showEndLoader={!loading && page < pageCount}
                onFilterChange={refetchWithFilter}
                loading={loading}
                error={error}
                onRetryClick={() => {
                    refetch({
                        page: page,
                        filter: filterRef.current,
                    })
                }}
            />
        </div>
    )
}
