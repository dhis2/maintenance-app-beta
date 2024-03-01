import type { useDataQuery } from '@dhis2/app-runtime'

export type QueryResponse = ReturnType<typeof useDataQuery>

export type Query = Parameters<typeof useDataQuery>[0]

export type ResourceQuery = Query[keyof Query]

export type QueryRefetchFunction = QueryResponse['refetch']

export type WrapQueryResponse<T, S extends string = 'result'> = {
    [K in S]: T
}

export type ResultQuery = {
    result: ResourceQuery
}
