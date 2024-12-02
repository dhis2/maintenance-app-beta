import { useMemo } from 'react'
import { useInfiniteQuery, useQuery } from 'react-query'
import { useBoundResourceQueryFn } from '../../../lib/query/useBoundQueryFn'
import { PlainResourceQuery } from '../../../types'
import { PagedResponse } from '../../../types/generated'
import { DisplayableModel } from '../../../types/models'

type Response<Model> = PagedResponse<Model, string>

const defaultQuery = {
    params: {
        order: 'displayName:asc',
        fields: ['id', 'displayName'],
        pageSize: 2,
    },
} satisfies Omit<PlainResourceQuery, 'resource'>

type UseModelMultiSelectQueryOptions<TModel extends DisplayableModel> = {
    query: Omit<PlainResourceQuery, 'id'>
    selected: TModel[] | string[]
}
export const useModelMultiSelectQuery = <TModel extends DisplayableModel>({
    query,
    selected,
}: UseModelMultiSelectQueryOptions<TModel>) => {
    const queryFn = useBoundResourceQueryFn()
    const modelName = query.resource
    const queryResult = useInfiniteQuery({
        queryKey: [query],
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
    // in case selected are string  (eg. a modelId) and are not in available data- resolve ids to a displayable model
    const selectedWithoutData = selected.filter(
        (s) =>
            typeof s === 'string' &&
            flatData.length > 0 &&
            !flatData.find((d) => d.id === s)
    )

    const selectedQuery = useQuery({
        queryKey: [
            {
                resource: modelName,
                params: {
                    filter: [`id:in:[${selectedWithoutData?.join()}]`],
                    order: defaultQuery.params.order,
                    fields: defaultQuery.params.fields,
                    paging: false, // this should be OK since selected should be a limited list...
                },
            },
        ] as const,
        queryFn: queryFn<Response<TModel>>,
        enabled: selectedWithoutData.length > 0,
    })
    const resolvedSelected = selected.map((s) => {
        if (typeof s === 'string') {
            return (
                flatData.find((d) => d.id === s) ||
                selectedQuery.data?.[modelName].find((d) => d.id === s) ||
                ({
                    id: s,
                    displayName: s,
                } as TModel)
            )
        }
        return s
    })

    return {
        selected: resolvedSelected,
        available: flatData,
        isLoading: queryResult.isLoading || selectedQuery.isLoading,
        error: queryResult.error || selectedQuery.error,
        availableQuery: queryResult,
        selectedQuery,
    }
}
