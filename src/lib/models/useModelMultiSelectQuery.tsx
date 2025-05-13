import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { PlainResourceQuery } from '../../types'
import {
    PagedResponse,
    PartialLoadedDisplayableModel,
} from '../../types/models'
import { useBoundResourceQueryFn } from '../query/useBoundQueryFn'

type Response<Model> = PagedResponse<Model, string>

const defaultQuery = {
    params: {
        order: 'displayName:asc',
        fields: ['id', 'displayName'],
        pageSize: 10,
    },
} satisfies Omit<PlainResourceQuery, 'resource'>

const withDefaultQuery = (query: PlainResourceQuery) => {
    return {
        ...defaultQuery,
        ...query,
        params: {
            ...defaultQuery.params,
            ...query.params,
        },
    }
}

type UseModelMultiSelectQueryOptions<
    TModel extends PartialLoadedDisplayableModel
> = {
    query: Omit<PlainResourceQuery, 'id'>
    selected?: TModel[]
}

/**
 * A reuseable generic hook for getting a paged list of models and resolving selected ids to displayable models.
 * Useful for selector components.
 *
 * @param query - the resource query to describe the request. Should in most cases be a query for a list of models
 * @param selected - a list of selected models, can be either a list of displayable models or a list of model ids.
 * If IDs are used, the hook will try to resolve the ids to displayable models (eg. fetching the displayName)
 * @returns
 */
export const useModelMultiSelectQuery = <
    TModel extends PartialLoadedDisplayableModel
>({
    query,
    selected,
}: UseModelMultiSelectQueryOptions<TModel>) => {
    const queryFn = useBoundResourceQueryFn()
    const modelName = query.resource
    const mergedQuery = withDefaultQuery(query)
    const queryResult = useInfiniteQuery({
        queryKey: [mergedQuery],
        queryFn: queryFn<Response<TModel>>,
        keepPreviousData: true,
        getNextPageParam: (lastPage) =>
            lastPage.pager.nextPage ? lastPage.pager.page + 1 : undefined,
        getPreviousPageParam: (firstPage) =>
            firstPage.pager.prevPage ? firstPage.pager.page - 1 : undefined,
    })
    const flatData = useMemo(
        () => queryResult.data?.pages.flatMap((page) => page[modelName]) ?? [],
        [queryResult.data, modelName]
    )
    // in case selected dont have a displayName and are not in available data- resolve ids to a displayable model
    const selectedWithoutData = useMemo(
        () =>
            selected
                ?.filter(
                    (s) =>
                        s.displayName === undefined &&
                        flatData.length > 0 &&
                        !flatData.find((d) => d.id === s.id)
                )
                .map((s) => s.id),
        [selected, flatData]
    )

    const selectedQuery = useQuery({
        queryKey: [
            {
                resource: modelName,
                params: {
                    ...mergedQuery.params,
                    filter: [`id:in:[${selectedWithoutData?.join()}]`],
                    paging: false, // this should be OK since selected should be a limited list...
                },
            },
        ] as const,
        queryFn: queryFn<Response<TModel>>,
        enabled: selectedWithoutData && selectedWithoutData.length > 0,
    })

    const resolvedSelected = useMemo(
        () =>
            selected?.map((s) => {
                if (s.displayName === undefined) {
                    return (
                        flatData.find((d) => d.id === s.id) ||
                        selectedQuery.data?.[modelName].find(
                            (d) => d.id === s.id
                        ) ||
                        s
                    )
                }
                return s
            }),
        [selected, flatData, selectedQuery.data, modelName]
    )

    return {
        selected: resolvedSelected || [],
        available: flatData,
        isLoading:
            queryResult.isLoading ||
            (selectedQuery.isLoading && !selectedQuery.isStale),
        error: queryResult.error || selectedQuery.error,
        availableQuery: queryResult,
        selectedQuery,
    }
}
