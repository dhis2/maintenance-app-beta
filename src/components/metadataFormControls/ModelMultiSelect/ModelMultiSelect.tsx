import React, { useMemo, useRef, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { PlainResourceQuery } from '../../../types'
import { DisplayableModel } from '../../../types/models'
import {
    BaseModelMultiSelect,
    BaseModelMultiSelectProps,
} from './BaseModelMultiSelect'
import { useModelMultiSelectQuery } from './useModelMultiSelectQuery'

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
    // keep select in ref, so we dont recompute for inline selects
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
    const {
        selected: selectedData,
        available: availableData,
        isLoading,
        error,
        availableQuery,
    } = useModelMultiSelectQuery({
        query: queryObject,
        selected,
    })

    const resolvedAvailable = select ? select(availableData) : availableData

    const handleFilterChange = useDebouncedCallback(({ value }) => {
        if (value != undefined) {
            setSearchTerm(value)
        }
        baseModelSingleSelectProps.onFilterChange?.(value)
    }, 250)

    return (
        <BaseModelMultiSelect
            {...baseModelSingleSelectProps}
            selected={selectedData}
            available={resolvedAvailable}
            onFilterChange={handleFilterChange}
            onRetryClick={availableQuery.refetch}
            showEndLoader={!!availableQuery.hasNextPage}
            onEndReached={() => !isLoading && availableQuery.fetchNextPage()}
            loading={isLoading}
            error={error?.toString()}
        />
    )
}
