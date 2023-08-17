import { useDataQuery } from '@dhis2/app-runtime'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { SearchableSingleSelect } from '../SearchableSingleSelect'

interface CategoryComboQueryResult {
    categoryCombos: {
        pager: {
            pageCount: number
            pageSize: number
            page: number
            total: number
        }
        categoryCombos: Array<{
            id: string
            displayName: string
        }>
    }
}

type QueryParams = {
    page: number
    pageSize: number
    fields: string[]
    filter?: string
}

const query = {
    categoryCombos: {
        resource: 'categoryCombos',
        params: ({ ...dynamicParams }) => {
            const baseParams: QueryParams = {
                page: dynamicParams.page,
                pageSize: 20,
                fields: ['id', 'displayName'],
            }

            if (dynamicParams.filter) {
                baseParams.filter = `displayName:ilike:${dynamicParams.filter}`
            }

            return baseParams
        },
    },
}

interface Option {
    value: string
    label: string
}
export function CategoryComboSelect({
    onChange,
    selected,
}: {
    onChange: ({ value, label }: Option) => void
    // Must be an option as we always must supply the selected option, but the
    // list might not contain it when filtering / loading the first page of
    // options
    selected?: Option
}) {
    // Using a ref because we don't want to react to a change of this value
    // It's guaranteed that we have the correct value because we reset the
    // value before fetching a new set of options when filtering / resetting
    // the filter as well as setting the value after the fetch has completed
    // but before we call a state setter. The state setter will cause a
    // rerender during which the new pages value can be accessed already
    const pages = useRef(1)
    const [loadedOptions, setLoadedOptions] = useState<
        Array<{
            value: string
            label: string
        }>
    >([])

    const [params, setParams] = useState({ page: 1, filter: '' })
    const adjustQueryParamsWithChangedFilter = useCallback(
        ({ value }: { value: string }) => {
            pages.current = 1
            setLoadedOptions([])
            setParams({ page: 1, filter: value })
        },
        []
    )

    const incrementPage = ({ isIntersecting }: { isIntersecting: boolean }) => {
        if (!isIntersecting) {
            return false
        }

        setParams((prevParams) => {
            const prevPage = prevParams.page
            const nextPage = prevPage < pages.current ? prevPage + 1 : prevPage
            return { ...prevParams, page: nextPage }
        })
    }

    const queryResult = useDataQuery<CategoryComboQueryResult>(query, {
        lazy: true,
        onComplete: (data) => {
            pages.current = data.categoryCombos.pager.pageCount
            // We want to add new options to existing ones so we don't have to
            // refetch existing options
            setLoadedOptions((prevLoadedOptions) => [
                ...prevLoadedOptions,
                ...(data?.categoryCombos.categoryCombos.map(
                    ({ id, displayName }) => ({
                        value: id,
                        label: displayName,
                    })
                ) || []),
            ])
        },
    })

    const { refetch } = queryResult
    useEffect(() => {
        refetch(params)
    }, [params, refetch])

    const actualOptions =
        !selected ||
        loadedOptions.find(({ value }) => value === selected?.value)
            ? loadedOptions
            : [selected, ...loadedOptions]

    return (
        <SearchableSingleSelect
            onChange={({ selected }) => {
                const nextSelected = loadedOptions.find(
                    ({ value }) => value === selected
                )
                onChange(nextSelected as Option)
            }}
            onIntersectionChange={incrementPage}
            options={actualOptions}
            preventIntersectionDetection={queryResult.loading}
            selected={selected?.value}
            showEndLoader={!queryResult.loading && params.page < pages.current}
            onFilterChange={adjustQueryParamsWithChangedFilter}
        />
    )
}
