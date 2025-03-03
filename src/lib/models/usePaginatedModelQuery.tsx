import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { PlainResourceQuery } from '../../types'
import { PagedResponse } from '../../types/models'
import { useBoundResourceQueryFn } from '../query/useBoundQueryFn'

type Response<Model> = PagedResponse<Model, string>

const defaultQuery = {
    params: {
        order: 'displayName:asc',
        fields: ['id', 'displayName'],
        pageSize: 15,
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

type UsePaginatedModelQueryOptions = {
    query: Omit<PlainResourceQuery, 'id'>
    /**
     * A convenience property for adding identifiable:token:search to the filter of the query.
     */
    search?: string
}

/**
 * A reuseable generic hook for getting a paged list of models with convenience for search/filtering.
 *
 * @param query - the resource query to describe the request. Should in most cases be a query for a list of models
 * @param selected - a list of selected models, can be either a list of displayable models or a list of model ids.
 * If IDs are used, the hook will try to resolve the ids to displayable models (eg. fetching the displayName)
 * @returns
 */
export const usePaginatedModelQuery = <TModel,>({
    search,
    query,
}: UsePaginatedModelQueryOptions) => {
    const querySearchFilter = !search ? [] : [`identifiable:token:${search}`]
    const queryFn = useBoundResourceQueryFn()
    const modelName = query.resource
    const mergedQuery = withDefaultQuery({
        ...query,
        params: {
            ...query.params,
            filter: querySearchFilter.concat(query.params?.filter ?? []),
        },
    })
    const queryResult = useInfiniteQuery({
        queryKey: [mergedQuery],
        queryFn: queryFn<Response<TModel>>,
        keepPreviousData: true,
        getNextPageParam: (lastPage) =>
            lastPage.pager.nextPage ? lastPage.pager.page + 1 : undefined,
        getPreviousPageParam: (firstPage) =>
            firstPage.pager.prevPage ? firstPage.pager.page - 1 : undefined,
        staleTime: 60 * 1000,
    })
    const flatData = useMemo(
        () => queryResult.data?.pages.flatMap((page) => page[modelName]) ?? [],
        [queryResult.data, modelName]
    )

    return {
        ...queryResult,
        allData: flatData,
    }
}
