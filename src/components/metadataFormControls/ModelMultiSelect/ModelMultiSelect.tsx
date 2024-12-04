import React, { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { useModelMultiSelectQuery } from '../../../lib/models/useModelMultiSelectQuery'
import { PlainResourceQuery } from '../../../types'
import { PartialLoadedDisplayableModel } from '../../../types/models'
import {
    BaseModelMultiSelect,
    BaseModelMultiSelectProps,
} from './BaseModelMultiSelect'

export type ModelMultiSelectProps<
    TModel extends PartialLoadedDisplayableModel
> = Omit<
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
    /* Select is a way to transform or filter out available options */
    select?: (value: TModel[]) => TModel[]
    selected: TModel[] | undefined
}

export const ModelMultiSelect = <TModel extends PartialLoadedDisplayableModel>({
    selected = [],
    query,
    select,
    ...baseModelSingleSelectProps
}: ModelMultiSelectProps<TModel>) => {
    const [searchTerm, setSearchTerm] = useState('')
    const searchFilter = `identifiable:token:${searchTerm}`
    const filter: string[] = searchTerm ? [searchFilter] : []
    const params = query.params

    const queryObject = {
        ...query,
        params: {
            ...params,
            filter: filter.concat(params?.filter || []),
        },
    }
    const {
        selected: selectedData,
        selectedQuery,
        available: availableData,
        isLoading,
        error,
        availableQuery,
    } = useModelMultiSelectQuery({
        query: queryObject,
        selected,
    })
    const onChange = baseModelSingleSelectProps.onChange

    // if we had to fetch selected data, update the form value
    // this basically adds the displayName to the formState
    useEffect(() => {
        if (!selectedQuery.data) {
            return
        }
        const hasSelectedWithoutData = selected.some(
            (s) => s.displayName === undefined
        )

        if (hasSelectedWithoutData) {
            onChange({ selected: selectedData })
        }
    }, [selectedQuery.data, selected, selectedData, onChange])

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
