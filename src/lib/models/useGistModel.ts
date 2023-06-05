//@ts-nocheck
import { useDataQuery, useDataEngine } from '@dhis2/app-runtime'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
    GistModel,
    GistParams as BaseGistParams,
    GistPreferences,
    IdentifiableObject,
    DataElement,
    GetReferencedModels,
} from '../../types/models'
import { QueryResponse, Query } from '../../types/query'

type GistParams = Omit<BaseGistParams, 'fields' | 'filter'> & {
    fields: string | string[]
    filter: string | string[]
}

type GistCollectionResourceString = string
type GistObjectResourceString = `${string}/${string}`
type GistObjectFieldResourceString = `${string}/${string}/${string}`
type GistResourceType = 'collection' | 'object' | 'objectField'

enum GistResourceTypeEnum {
    Collection = 'collection',
    Object = 'object',
    ObjectField = 'objectField',
}

// type ResolvedGistResource = {
//     resource: GistResource
// }

// type GistCollectionResource = ResolvedGistResource & {
//     type: 'collection'
// }

// type GistObjectResource = {
//     type: 'object'
// }
type GistResource =
    | GistObjectFieldResourceString
    | GistCollectionResourceString
    | GistObjectResourceString

type GistResourceString = `${GistResource}/gist`
type ResourceQuery = Query[number]
type GistResourceQuery = Omit<ResourceQuery, 'resource'> & {
    resource: GistResource
}

// note that we do not support parallel queries
// this makes it significantly easier to implement
// and parallel use of gist queries shouldn't be a common use case
type GistQuery = {
    data: GistResourceQuery
}

type GistModelCollection<
    Resource extends GistCollectionResourceString,
    T extends IdentifiableObject
> = {
    [K in Resource]: GistModel<T>[]
}
type GistCollectionResponse<
    Resource extends GistCollectionResourceString,
    T extends IdentifiableObject
> = {
    pager: GistPager
} & GistModelCollection<Resource, T>

type GistObject<T extends IdentifiableObject> = GistModel<T>
type GistObjectField = unknown

type GistResult<
    Resource extends GistResource,
    T extends IdentifiableObject,
    ResourceType extends GistResourceTypeEnum
> = ResourceType extends GistResourceTypeEnum.Collection
    ? GistCollectionResponse<Resource, T>
    : ResourceType extends GistResourceTypeEnum.Object
    ? GistObject<T>
    : GistObjectField

function createGistResponse(queryResponse: ReturnType<typeof useDataQuery>) {
    const { loading, error, data } = queryResponse
    data
    return Object.entries(queryResponse).reduce((acc, [key, value]) => {
        return acc
    }, {} as GistResponse)
}

function createApiEndpointQueries(resources: Record<string, string>) {
    return resources.reduce((acc, resource) => {
        acc[resource] = {
            resource: `${resource}/gist`,
        }
        return acc
    }, {} as GistQuery)
}

function createGistQuery(
    resource: GistResource,
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

function usePagination({}) {
    const [page, setPage] = React.useState(1)
    const nextPage = () => setPage((page) => page + 1)
    const prevPage = () => setPage((page) => page - 1)
    return {
        page,
        nextPage,
        prevPage,
    }
}

type GistPager = {
    page: number
    pageSize: number
    prevPage?: string
    nextPage?: string
}
type GistPaginator = {
    getNextPage: () => void
    getPrevPage: () => void
}

type GistResultPagination = GistPager & GistPaginator

type GistApiEndPointTypes<Model extends IdentifiableObject> =
    GetReferencedModels<Model>

type UseGistModelResult<Model extends IdentifiableObject> = Pick<
    QueryResponse,
    'loading' | 'error' | 'called'
> & {
    data: GistModel<Model>
    pagination: GistResultPagination
    referenceHooks: {
        [P in GistModel<Model>['apiEndpoints']]: () => UseGistModelResult<unknown>
    }
}

type ResolveResourceTypeFromString<R extends GistResource> =
    R extends GistObjectFieldResourceString
        ? GistResourceTypeEnum.ObjectField
        : R extends GistObjectResourceString
        ? GistResourceTypeEnum.Object
        : GistResourceTypeEnum.Collection

const resolveResourceType = (resource: string): GistResourceTypeEnum => {
    const parts = resource.split('/')
    switch (parts.length) {
        case 1:
            return GistResourceTypeEnum.Collection
        case 2:
            return GistResourceTypeEnum.Object
        case 3:
            return GistResourceTypeEnum.ObjectField
        default: {
            throw new Error('Invalid resource')
        }
    }
}

const isDataCollection = <Resource extends GistResource>(
    resource: GistResource,
    data: unknown
): data is GistCollectionResponse<Resource, IdentifiableObject> => {
    return Array.isArray((data as any)[resource])
}

const verifyDataMatchesResourceType = (data: unknown, resource: string) => {}
const createPagination = (data: GistPager): GistResultPagination => {}

export function useGistModel<
    T extends IdentifiableObject,
    R extends GistResource,
    ResourceType extends GistResourceTypeEnum = ResolveResourceTypeFromString<R>
>(resource: R, params?: GistParams) {
    const gistResource: GistResource = `${resource}/gist`
    const [gistQuery] = useState<GistQuery>(
        createGistQuery(gistResource, params)
    )

    const resourceType = resolveResourceType(resource) as ResourceType
    // const gistQuery = useRef<GistQuery>(createGistQuery(gistResource, params))
    const [apiEndpointQueries, setApiEndpointQueries] = React.useState({})
    const queryResponse =
        useDataQuery<GistResult<R, T, ResourceType>>(gistQuery)
    // queryResponse.data?.pager

    //const pagination = useMemo(() => createPagination(queryResponse), [])
    // queryResponse.
    return React.useMemo(() => {
        if (
            queryResponse.loading ||
            queryResponse.error ||
            !queryResponse.data
        ) {
            return queryResponse
        }
        if (isDataCollection(resource, queryResponse.data)) {
            const collection = queryResponse.data[resource]
            // collection.map(item => {
            //     item.apiEndpoints.
            // })
        }
        const originalData = queryResponse.data
        const apiEndPointsQueries = Object.entries(originalData).map(
            ([key, value]) => {
                const resources = value.apiEndpoints
                return [key, createApiEndpointQueries(resources)]
            }
        )
        const resources = Object.keys(originalData)
        const apiEndpointQueries = createApiEndpointQueries(resources)
    }, [queryResponse])
}

const data = useGistModel('dataElements/asf')
// data?.data.
