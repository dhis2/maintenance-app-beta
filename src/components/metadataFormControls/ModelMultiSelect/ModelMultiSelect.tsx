import React, { useMemo, useRef, useState } from 'react'
import { useInfiniteQuery, useQuery } from 'react-query'
import { useDebouncedCallback } from 'use-debounce'
import { useBoundResourceQueryFn } from '../../../lib/query/useBoundQueryFn'
import { PlainResourceQuery } from '../../../types'
import { PagedResponse } from '../../../types/generated'
import { DisplayableModel } from '../../../types/models'
import {
    BaseModelMultiSelect,
    BaseModelMultiSelectProps,
} from './BaseModelMultiSelect'

type Response<Model> = PagedResponse<Model, string>

const defaultQuery = {
    params: {
        order: 'displayName:asc',
        fields: ['id', 'displayName'],
        pageSize: 10,
    },
} satisfies Omit<PlainResourceQuery, 'resource'>

export type ModelMultiSelectProps<TModel extends DisplayableModel> = Omit<
    BaseModelMultiSelectProps<TModel>,
    | 'available'
    | 'onFilterChange'
    | 'onRetryClick'
    | 'onEndReached'
    | 'showEndLoader'
    | 'loading'
    | 'error'
    | 'selected'
> & {
    query: Omit<PlainResourceQuery, 'id'>
    onFilterChange?: (value: string) => void
    select?: (value: TModel[]) => TModel[]
    selected: TModel[] | string[] | undefined
}

export const ModelMultiSelect = <TModel extends DisplayableModel>({
    selected = [],
    query,
    select,
    ...baseModelSingleSelectProps
}: ModelMultiSelectProps<TModel>) => {
    const queryFn = useBoundResourceQueryFn()
    // keep select in ref, so we dont recompute for inline selects
    const selectRef = useRef(select)
    const [searchTerm, setSearchTerm] = useState('')
    const searchFilter = `identifiable:token:${searchTerm}`
    const filter: string[] = searchTerm ? [searchFilter] : []
    const params = query.params

    const queryObject = {
        ...query,
        params: {
            ...defaultQuery.params,
            ...params,
            filter: filter.concat(params?.filter || []),
        },
    }
    const modelName = query.resource

    const queryResult = useInfiniteQuery({
        queryKey: [queryObject] as const,
        queryFn: queryFn<Response<TModel>>,
        keepPreviousData: true,
        getNextPageParam: (lastPage) =>
            lastPage.pager.nextPage ? lastPage.pager.page + 1 : undefined,
        getPreviousPageParam: (firstPage) =>
            firstPage.pager.prevPage ? firstPage.pager.page - 1 : undefined,
    })

    const allDataMap = useMemo(() => {
        const flatData =
            queryResult.data?.pages.flatMap((page) => page[modelName]) ?? []
        if (selectRef.current) {
            return selectRef.current(flatData)
        }
        return flatData
    }, [queryResult.data, modelName])

    const selectedWithoutData = selected.filter(
        (s) => allDataMap.find((d) => d.id === s) === undefined
    )

    const selectedQuery = useQuery({
        queryKey: [
            {
                resource: modelName,
                params: { filter: [`id:in:[${selected?.join()}]`] },
            },
        ] as const,
        queryFn: queryFn<Response<TModel>>,
        enabled:
            typeof selected?.[0] === 'string' && selectedWithoutData.length > 0,
    })

    const resolvedSelected = useMemo(() => {
        if (selectedQuery.data) {
            return selectedQuery.data[modelName]
        }
        if (selectedWithoutData.length === 0) {
            return selected.map(
                (s) => allDataMap.find((d) => d.id === s) as TModel
            )
        }
        return selected as TModel[]
    }, [
        selectedQuery.data,
        selected,
        modelName,
        allDataMap,
        selectedWithoutData.length,
    ])
    console.log({ resolvedSelected, selected })
    const handleFilterChange = useDebouncedCallback(({ value }) => {
        if (value != undefined) {
            setSearchTerm(value)
        }
        baseModelSingleSelectProps.onFilterChange?.(value)
    }, 250)

    return (
        <BaseModelMultiSelect
            {...baseModelSingleSelectProps}
            selected={resolvedSelected}
            available={allDataMap}
            onFilterChange={handleFilterChange}
            onRetryClick={queryResult.refetch}
            showEndLoader={!!queryResult.hasNextPage}
            onEndReached={queryResult.fetchNextPage}
            loading={queryResult.isLoading}
            error={queryResult.error as string | undefined}
        />
    )
}
