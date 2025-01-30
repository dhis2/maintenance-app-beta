import { useDataEngine } from '@dhis2/app-runtime'
import { QueryFunctionContext } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { DataEngine, Query, ResourceQuery } from '../../types'

type DataQueryQueryKey = Readonly<[Query, ...unknown[]]>
type ResourceQueryKey = Readonly<[ResourceQuery, ...unknown[]]>

export const createBoundQueryFn =
    (engine: DataEngine) =>
    <TData>({
        queryKey: [query],
        signal,
    }: QueryFunctionContext<DataQueryQueryKey>) =>
        engine.query(query, { signal }) as Promise<TData> // engine.query is not generic...

export const useBoundQueryFn = () => {
    const dataEngine = useDataEngine()

    return useMemo(() => createBoundQueryFn(dataEngine), [dataEngine])
}

const mergePageParam = (query: ResourceQuery, pageParam?: number) => {
    return {
        ...query,
        params: {
            ...query.params,
            page: pageParam,
        },
    }
}

export const createBoundResourceQueryFn =
    (engine: DataEngine) =>
    async <TData>({
        queryKey: [query],
        pageParam,
        signal,
    }: QueryFunctionContext<ResourceQueryKey>) => {
        const result = await engine.query(
            {
                result:
                    typeof pageParam === 'number'
                        ? mergePageParam(query, pageParam)
                        : query,
            },
            { signal }
        )
        return result.result as TData
    }

export const useBoundResourceQueryFn = () => {
    const dataEngine = useDataEngine()

    return useMemo(() => createBoundResourceQueryFn(dataEngine), [dataEngine])
}
