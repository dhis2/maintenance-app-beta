import { useDataQuery } from '@dhis2/app-runtime'
import React, { useState, useCallback } from 'react'
import {
    GistParams as BaseGistParams,
    IdentifiableObject,
    GistResponse,
    GistPager,
    GistCollectionResponse,
    GistPagedResponse,
    GistObjectResponse,
} from '../../types/models'
import { QueryResponse, Query } from '../../types/query'

// these normally are just strings, but useQuery supports arrays
export type GistParams = Omit<BaseGistParams, 'fields' | 'filter'> & {
    fields?: string | string[]
    filter?: string | string[]
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
    result: GistResourceQuery
}

type GistQueryResult<Response> = {
    result: Response
}

function createGistQuery(
    resource: GistResourceString,
    params?: GistParams
): GistQuery {
    return {
        result: {
            resource: `${resource}`,
            params: ({ ...dynamicParams }) => ({
                pageListName: 'result',
                total: true,
                order: 'name:ASC',
                ...params,
                ...dynamicParams,
            }),
        },
    }
}

function usePagination(
    refetch: QueryResponse['refetch'],
    data?: unknown
): GistPaginator | null {
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

    const goToPage = useCallback(
        (page: number) => {
            if (!pager?.pageCount || page > pager.pageCount) {
                return false
            }
            refetch({ page: page })
            return true
        },
        [refetch, pager]
    )

    const changePageSize = useCallback(
        (pageSize: number) => {
            refetch({ pageSize: pageSize })
            return true
        },
        [refetch]
    )

    return {
        getNextPage,
        getPrevPage,
        goToPage,
        changePageSize,
        pager,
    }
}

export type GistPaginator = {
    changePageSize: (pageSize: number) => boolean
    getNextPage: () => boolean
    getPrevPage: () => boolean
    goToPage: (page: number) => boolean
    pager?: GistPager
}

type BaseUseModelGistResult<Response> = Pick<
    QueryResponse,
    'loading' | 'error' | 'called' | 'refetch'
> & {
    data?: Response
}

type UseModelGistResultPaginated<Response> =
    BaseUseModelGistResult<Response> & {
        pagination: GistPaginator
    }
type UseModelGistResult<Response extends GistResponse> =
    | BaseUseModelGistResult<Response>
    | UseModelGistResultPaginated<Response>

export const isDataCollection = (
    data: unknown
): data is GistCollectionResponse<IdentifiableObject> => {
    // gist endpoints are always paged if they're collections
    return (data as GistCollectionResponse)?.pager !== undefined
}

export function useModelGist<Response extends GistPagedResponse>(
    gistResource: GistResourceString,
    params?: GistParams
): UseModelGistResultPaginated<Response>

export function useModelGist<Response extends GistObjectResponse>(
    gistResource: GistResourceString,
    params?: GistParams
): UseModelGistResult<Response>

export function useModelGist<Response extends GistResponse>(
    gistResource: GistResourceString,
    params?: GistParams
): UseModelGistResult<Response> {
    const [gistQuery] = useState<GistQuery>(
        createGistQuery(gistResource, params)
    )
    const queryResponse = useDataQuery<GistQueryResult<Response>>(gistQuery)

    const pagination = usePagination(
        queryResponse.refetch,
        queryResponse.data?.result
    )

    return React.useMemo(() => {
        const baseResult: UseModelGistResult<Response> = {
            loading: queryResponse.loading,
            called: queryResponse.called,
            error: queryResponse.error,
            data: queryResponse.data?.result,
            refetch: queryResponse.refetch,
        }
        if (pagination) {
            const result: UseModelGistResultPaginated<Response> = {
                ...baseResult,
                pagination,
            }
            return result
        }
        return baseResult
    }, [queryResponse, pagination])
}
