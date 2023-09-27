import { useDataEngine } from '@dhis2/app-runtime'
import React, { useState } from 'react'
import { useInfiniteQuery, QueryFunctionContext } from 'react-query'
import { useModelSectionHandleOrThrow } from '../../../lib'
import { Query } from '../../../types'
import {
    BaseIdentifiableObject,
    IdentifiableObject,
    ModelCollectionResponse,
} from '../../../types/generated'
import { SearchableSingleSelect } from '../../SearchableSingleSelect'
import { useSectionListFilter } from './useSectionListFilter'

type SimpleQuery = {
    resource: string
    fields?: string[]
    order?: string[]
}

type GenericSelectionFilterProps = {
    label: string
    filterKey: string
    query: SimpleQuery
}
type WrapInData<T> = { data: T }

const infiniteQueryFn =
    (dataEngine: ReturnType<typeof useDataEngine>) =>
    ({
        queryKey: [query],
        pageParam = 1,
        signal,
    }: QueryFunctionContext<[Query], number>) => {
        const pagedQuery = {
            data: {
                ...query.data,
                params: {
                    ...query.data.params,
                    page: pageParam,
                },
            },
        }
        return dataEngine.query(pagedQuery, {
            signal,
        }) as Promise<
            WrapInData<ModelCollectionResponse<BaseIdentifiableObject, string>>
        >
    }

export const GenericSelectionFilter = ({
    filterKey,
    label,
    query,
}: GenericSelectionFilterProps) => {
    const dataEngine = useDataEngine()
    const [filter, setFilter] = useSectionListFilter(filterKey)
    const [searchValue, setSearchValue] = useState<string>('')

    const handleChange = ({ selected }: { selected: string }) => {
        setFilter(selected)
    }

    const optionsQuery = {
        data: {
            resource: query.resource,
            params: {
                pageSize: 20,
                fields:
                    query.fields?.length && query.fields?.length > 0
                        ? query.fields
                        : ['id', 'displayName'],
                filter: searchValue
                    ? `displayName:ilike:${searchValue}`
                    : undefined,
            },
        },
    }

    const res = useInfiniteQuery({
        queryKey: [optionsQuery],
        queryFn: infiniteQueryFn(dataEngine),
        getNextPageParam: (lastPage) => {
            const pager = lastPage?.data?.pager
            return pager.nextPage ? pager.page + 1 : undefined
        },
        getPreviousPageParam: (lastPage) => {
            const pager = lastPage?.data?.pager
            return pager.nextPage ? pager.page - 1 : undefined
        },
    })

    const displayOptions =
        res.data?.pages.flatMap((p) =>
            p.data[query.resource].map(({ id, displayName }) => ({
                value: id,
                label: displayName,
            }))
        ) ?? []

    return (
        <SearchableSingleSelect
            showAllOption={true}
            onChange={handleChange}
            onEndReached={res.fetchNextPage}
            options={displayOptions}
            selected={filter}
            showEndLoader={!res.isFetching && !!res.hasNextPage}
            onFilterChange={({ value }) => setSearchValue(value)}
            loading={false}
            label={label}
            error={res.error?.toString()}
            onRetryClick={() => {
                res.refetch()
            }}
        />
    )
}
