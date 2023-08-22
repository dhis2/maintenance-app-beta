import React, { useCallback, useRef, useState } from 'react'
import { useModelGist } from '../../lib'
import { CategoryCombo, GistCollectionResponse } from '../../types/generated'
import { SearchableSingleSelect } from '../SearchableSingleSelect'

const filterFields = ['id', 'name'] as const //(name is translated by default in /gist)
type FilteredCategoryCombo = Pick<CategoryCombo, (typeof filterFields)[number]>
type CategoryComboQueryResult = GistCollectionResponse<FilteredCategoryCombo>

interface Option {
    value: string
    label: string
}

export function CategoryComboSelect({
    onChange,
    selected,
}: {
    onChange: ({ selected }: { selected: string }) => void
    // Must be an option as we always must supply the selected option, but the
    // list might not contain it when filtering / loading the first page of
    // options
    selected?: string
}) {
    // Using a ref because we don't want to react to changes.
    // We're using this value only when imperatively calling `refetch`,
    // nothing that depends on the render-cycle depends on this value
    const filterRef = useRef('')

    const [loadedOptions, setLoadedOptions] = useState<Option[]>([])
    const queryResult = useModelGist<CategoryComboQueryResult>(
        'categoryCombos/gist',
        { pageSize: 10 },
        {
            variables: { page: 1, filter: '' },
            onComplete: (input: unknown) => {
                const data = input as { result: CategoryComboQueryResult }
                const { pager, result } = data.result
                // We want to add new options to existing ones so we don't have to
                // refetch existing options
                setLoadedOptions((prevLoadedOptions) => [
                    // We only want to add when the current page is > 1
                    ...(pager.page === 1 ? [] : prevLoadedOptions),
                    ...(result.map(({ id, name }) => ({
                        value: id,
                        label: name,
                    })) || []),
                ])

                return data
            },
        }
    )
    const { refetch, data } = queryResult
    const pager = data?.pager
    const page = pager?.page || 0
    const pageCount = pager?.pageCount || 0

    const adjustQueryParamsWithChangedFilter = useCallback(
        ({ value }: { value: string }) => {
            const nextFilter = value ? `name:ilike:${value}` : ''
            filterRef.current = nextFilter
            refetch({ page: 1, filter: nextFilter })
        },
        [refetch]
    )

    const incrementPage = useCallback(
        ({ isIntersecting }: { isIntersecting: boolean }) => {
            if (!isIntersecting) {
                return false
            }

            refetch({
                page: page < pageCount ? page + 1 : page,
                filter: filterRef.current,
            })
        },
        [refetch, page, pageCount]
    )

    const error = queryResult.error
        ? 'An error has occurred. Please try again'
        : ''
    console.log('> queryResult.error', queryResult.error)

    return (
        <SearchableSingleSelect
            onChange={onChange}
            onIntersectionChange={incrementPage}
            options={loadedOptions}
            preventIntersectionDetection={queryResult.loading}
            selected={selected}
            showEndLoader={!queryResult.loading && page < pageCount}
            onFilterChange={adjustQueryParamsWithChangedFilter}
            loading={queryResult.loading}
            error={error}
            onRetryClick={() => {
                refetch({
                    page: pager?.page || 1,
                    filter: filterRef.current,
                })
            }}
        />
    )
}
