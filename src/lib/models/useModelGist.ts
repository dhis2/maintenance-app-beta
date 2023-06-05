import { useDataQuery, useDataEngine } from '@dhis2/app-runtime'
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import {
    GistModel,
    GistParams as BaseGistParams,
    GistPreferences,
    IdentifiableObject,
    DataElement,
    GetReferencedModels,
    GistResponse,
    GistPager,
    GistCollectionResponse,
    GistPagedResponse,
    GistObjectResponse,
} from '../../types/models'
import { QueryResponse, Query } from '../../types/query'

// these normally are just strings, but useQuery supports arrays
type GistParams = Omit<BaseGistParams, 'fields' | 'filter'> & {
    fields: string | string[]
    filter: string | string[]
}
enum GistResourceTypeEnum {
    Collection = 'collection',
    Object = 'object',
    ObjectField = 'objectField',
}

type GistResourceString = `${string}/gist`
type ResourceQuery = Query[number]
type GistResourceQuery = Omit<ResourceQuery, 'resource'> & {
    resource: GistResourceString
}

// note that we do not support parallel queries
// this makes it significantly easier to implement
// and parallel use of gist queries shouldn't be a common use case
type GistQuery = {
    data: GistResourceQuery
}

function createGistResponse(queryResponse: ReturnType<typeof useDataQuery>) {
    const { loading, error, data } = queryResponse
    data
    return Object.entries(queryResponse).reduce((acc, [key, value]) => {
        return acc
    }, {} as GistResponse)
}

function createGistQuery(
    resource: GistResourceString,
    params?: GistParams
): GistQuery {
    return {
        data: {
            resource: `${resource}`,
            params: ({ page }) => ({
                ...params,
                page,
            }),
        },
    }
}

function usePagination(
    refetch: QueryResponse['refetch'],
    data?: unknown
): GistResultPagination | null {
    let pager: GistPager | undefined
    if (isDataCollection(data)) {
        pager = data.pager
    }
    const getNextPage = useCallback(() => {
        if (!pager?.nextPage) {
            return false
        }
        refetch({ page: pager.page + 1 })
        return true
    }, [refetch, pager])
    const getPrevPage = useCallback(() => {
        if (!pager?.prevPage) {
            return false
        }
        refetch({ page: pager.page - 1 })
        return true
    }, [refetch, pager])

    return useMemo(() => {
        if (!pager) {
            return null
        }
        return {
            ...pager,
            getNextPage,
            getPrevPage,
        }
    }, [pager, getNextPage, getPrevPage])
}

type GistPaginator = {
    getNextPage: () => boolean
    getPrevPage: () => boolean
}

type GistResultPagination = GistPager & GistPaginator

type Resz = string
type BaseUseGistModelResult<Response> = Pick<
    QueryResponse,
    'loading' | 'error' | 'called'
> & {
    data?: Response
}

type UseGistModelResultPaginated<Response> =
    BaseUseGistModelResult<Response> & {
        pagination: GistResultPagination
    }
type UseGistModelResult<Response extends GistResponse> =
    | BaseUseGistModelResult<Response>
    | UseGistModelResultPaginated<Response>

const paged = {} as UseGistModelResultPaginated<
    GistCollectionResponse<DataElement, 'dataElements'>
>

const isDataCollection = (
    data: unknown
): data is GistCollectionResponse<IdentifiableObject, GistResourceString> => {
    return (data as any).pager !== undefined
}

//const createPagination = (data: GistPager): GistResultPagination => {}

/**
 * Takes a string like "dataElements/gist" and returns the type of the resource, eg. "dataElements"
 *
 * @param gistResource
 */
const resolveResourceFromGistString = (
    gistResource: GistResourceString
): string => {
    const delimeter = '/'
    const apiDelimeter = '/api'
    const isAbsoluteResource = gistResource.includes(apiDelimeter)
    const gistUrlPart = isAbsoluteResource
        ? gistResource.split(apiDelimeter)[1]
        : gistResource
    return gistUrlPart.split(delimeter)[1]
}

export function useModelGist<
    Response extends GistPagedResponse,
    R extends string = string
    // ResourceType extends GistResourceTypeEnum = ResolveResourceTypeFromString<R>
>(
    gistResource: GistResourceString,
    params?: GistParams
): UseGistModelResultPaginated<Response>
export function useModelGist<
    Response extends GistObjectResponse
    // ResourceType extends GistResourceTypeEnum = ResolveResourceTypeFromString<R>
>(
    gistResource: GistResourceString,
    params?: GistParams
): UseGistModelResult<Response>
export function useModelGist<
    Response extends GistResponse<IdentifiableObject, R>,
    R extends string = string
    // ResourceType extends GistResourceTypeEnum = ResolveResourceTypeFromString<R>
>(
    gistResource: GistResourceString,
    params?: GistParams
): UseGistModelResult<Response> {
    const [gistQuery] = useState<GistQuery>(
        createGistQuery(gistResource, params)
    )
    const resource = resolveResourceFromGistString(gistResource)
    // const resourceType = resolveResourceType(resource) as ResourceType
    // const gistQuery = useRef<GistQuery>(createGistQuery(gistResource, params))
    // const [apiEndpointQueries, setApiEndpointQueries] = React.useState({})
    const queryResponse = useDataQuery<Response>(gistQuery)
    const pagination = usePagination(queryResponse.refetch, queryResponse.data)
    // queryResponse.data?.pager

    //const pagination = useMemo(() => createPagination(queryResponse), [])
    // queryResponse.
    return React.useMemo(() => {
        //const isCollection = isDataCollection(queryResponse.data)

        const baseResult: UseGistModelResult<Response> = {
            loading: queryResponse.loading,
            called: queryResponse.called,
            error: queryResponse.error,
            data: queryResponse.data,
        }
        if (pagination) {
            const result: UseGistModelResultPaginated<Response> = {
                ...baseResult,
                pagination,
            }
            return result
        }
        return baseResult
    }, [queryResponse, pagination])
}

// const data =
//     useModelGist<GistCollectionResponse<DataElement, 'dataElements'>>(
//         'dataElements/gist'
//     )
// data.
// data?.data.
