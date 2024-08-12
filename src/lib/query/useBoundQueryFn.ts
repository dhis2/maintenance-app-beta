import { useDataEngine } from '@dhis2/app-runtime'
import { useMemo } from 'react'
import { QueryFunctionContext } from 'react-query'
import type { DataEngine, Query, ResourceQuery } from '../../types'
// types not exported from app-runtime...

export const createBoundQueryFn =
    (engine: DataEngine) =>
    <TData>({ queryKey: [query], signal }: QueryFunctionContext<[Query]>) =>
        engine.query(query, { signal }) as Promise<TData> // engine.query is not generic...

export const useBoundQueryFn = () => {
    const dataEngine = useDataEngine()

    return useMemo(() => createBoundQueryFn(dataEngine), [dataEngine])
}

export const createBoundResourceQueryFn =
    (engine: DataEngine) =>
    async <TData>({
        queryKey: [query],
        signal,
    }: QueryFunctionContext<Readonly<[ResourceQuery]>>) => {
        const result = await engine.query({ result: query }, { signal })
        return result.result as TData
    }

export const useBoundResourceQueryFn = () => {
    const dataEngine = useDataEngine()

    return useMemo(() => createBoundResourceQueryFn(dataEngine), [dataEngine])
}
