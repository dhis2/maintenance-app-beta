import i18n from '@dhis2/d2-i18n'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import React, { useEffect, useMemo, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { useBoundResourceQueryFn } from '../../../lib/query/useBoundQueryFn'
import { PlainResourceQuery } from '../../../types'
import { PagedResponse } from '../../../types/generated'
import { PartialLoadedDisplayableModel } from '../../../types/models'
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

export type ModelSingleSelectProps<
    TModel extends PartialLoadedDisplayableModel = PartialLoadedDisplayableModel
> = Omit<
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
    transform?: (value: TModel[]) => TModel[]
    noMatchWithoutFilterText?: string
}

export const ModelSingleSelect = <
    TModel extends PartialLoadedDisplayableModel
>({
    selected,
    query,
    transform,
    noMatchWithoutFilterText,
    ...baseModelSingleSelectProps
}: ModelSingleSelectProps<TModel>) => {
    const queryFn = useBoundResourceQueryFn()
    const [searchTerm, setSearchTerm] = useState('')
    const onChange = baseModelSingleSelectProps.onChange

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
            lastPage.pager?.nextPage ? lastPage.pager.page + 1 : undefined,
        getPreviousPageParam: (firstPage) =>
            firstPage.pager?.prevPage ? firstPage.pager.page - 1 : undefined,
        staleTime: 60 * 1000,
    })

    const allDataMap = useMemo(() => {
        const flatData =
            queryResult.data?.pages.flatMap((page) => page[modelName]) ?? []
        return flatData
    }, [queryResult.data, modelName])

    const resolvedAvailable = useMemo(() => {
        return transform ? transform(allDataMap) : allDataMap
    }, [allDataMap, transform])

    useEffect(() => {
        // fetch until we have resolvedAvailable length equal to the desired page size (or until we reach the end)
        if (
            resolvedAvailable.length < (queryObject.params.pageSize ?? 10) &&
            queryResult.hasNextPage
        ) {
            queryResult.fetchNextPage()
        }
    }, [resolvedAvailable])

    const shouldFetchSelected =
        !!selected &&
        selected.displayName === undefined &&
        !!selected.id &&
        resolvedAvailable.length > 0 &&
        resolvedAvailable.find((a) => a.id === selected.id) === undefined

    // if we just have the ID - fetch the displayName
    const selectedQuery = useQuery({
        queryKey: [
            {
                resource: query.resource,
                id: selected?.id,
                params: {
                    fields: queryObject.params.fields,
                    order: queryObject.params.order,
                },
            },
        ],
        queryFn: queryFn<TModel>,
        enabled: shouldFetchSelected,
    })

    useEffect(() => {
        if (
            !selected ||
            !selectedQuery.data ||
            !shouldFetchSelected ||
            selected?.displayName !== undefined
        ) {
            return
        }
        // if we had to fetch the selected model, call the onChange
        // to update store with the full model
        onChange?.(selectedQuery.data)
    }, [selectedQuery.data, shouldFetchSelected, selected, onChange])

    const resolvedSelected =
        shouldFetchSelected && selectedQuery.data
            ? selectedQuery.data
            : selected

    const handleFilterChange = useDebouncedCallback(({ value }) => {
        if (value != undefined) {
            setSearchTerm(value)
        }
        baseModelSingleSelectProps.onFilterChange?.(value)
    }, 250)

    return (
        <BaseModelSingleSelect
            {...baseModelSingleSelectProps}
            selected={resolvedSelected}
            available={resolvedAvailable}
            onFilterChange={handleFilterChange}
            onRetryClick={queryResult.refetch}
            showEndLoader={!!queryResult.hasNextPage}
            onEndReached={queryResult.fetchNextPage}
            loading={queryResult.isLoading}
            error={queryResult.error?.toString()}
            noMatchWithoutFilterText={noMatchWithoutFilterText}
        />
    )
}
