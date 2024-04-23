import { useDataEngine } from '@dhis2/app-runtime'
import { QueryFunctionContext } from 'react-query'
import type { Query } from '../../types'

type DataEngine = ReturnType<typeof useDataEngine>

export const createBoundQueryFn =
    <TData>(engine: DataEngine) =>
    ({ queryKey: [query], signal }: QueryFunctionContext<[Query]>) =>
        engine.query(query, { signal }) as Promise<TData> // engine.query is not generic...
