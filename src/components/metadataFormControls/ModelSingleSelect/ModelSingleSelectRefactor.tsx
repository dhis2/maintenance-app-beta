import React, { useMemo, useRef, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import { useDebouncedCallback } from 'use-debounce'
import { useBoundResourceQueryFn } from '../../../lib/query/useBoundQueryFn'
import { PlainResourceQuery } from '../../../types'
import { PagedResponse } from '../../../types/generated'
import { DisplayableModel } from '../../../types/models'
import {
    BaseModelSingleSelect,
    BaseModelSingleSelectProps,
} from './BaseModelSingleSelect'

type Response<Model> = PagedResponse<Model, string>

const defaultQuery = {
    params: {
        order: 'displayName:asc',
        fields: ['id', 'displayName'],
        pageSize: 10,
    },
} satisfies Omit<PlainResourceQuery, 'resource'>

export type ModelSingleSelectProps<TModel extends DisplayableModel> = Omit<
    BaseModelSingleSelectProps<TModel>,
    | 'available'
    | 'onFilterChange'
    | 'onRetryClick'
    | 'onEndReached'
    | 'showEndLoader'
    | 'loading'
    | 'error'
> & {
    query: Omit<PlainResourceQuery, 'id'>
    onFilterChange?: (value: string) => void
    select?: (value: TModel[]) => TModel[]
}

export const ModelSingleSelect = <TModel extends DisplayableModel>({
    selected,
    query,
    select,
    ...baseModelSingleSelectProps
}: ModelSingleSelectProps<TModel>) => {
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

    const handleFilterChange = useDebouncedCallback(({ value }) => {
        if (value != undefined) {
            setSearchTerm(value)
        }
        baseModelSingleSelectProps.onFilterChange?.(value)
    }, 250)

    return (
        <BaseModelSingleSelect
            {...baseModelSingleSelectProps}
            selected={selected}
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
