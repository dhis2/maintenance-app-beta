import type { useDataQuery } from '@dhis2/app-runtime'
import { useDataEngine } from '@dhis2/app-runtime'

export type DataEngine = ReturnType<typeof useDataEngine>
export type QueryResponse = ReturnType<typeof useDataQuery>

export type Query = Parameters<typeof useDataQuery>[0]

type QueryParams = {
    pageSize?: number
    page?: number
    fields?: string | string[]
    filter?: string | string[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
}

/* A simple resource-query, without params callback */
export type PlainResourceQuery = {
    resource: string
    id?: string
    params?: QueryParams
}

export type ResourceQuery = Query[keyof Query]

export type QueryRefetchFunction = QueryResponse['refetch']

export type WrapQueryResponse<T, S extends string = 'result'> = {
    [K in S]: T
}

export type ResultQuery = {
    result: ResourceQuery
}
