import { useDataEngine } from '@dhis2/app-runtime'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
    useQuery,
    useQueryClient,
    useQueries,
    UseQueryOptions,
} from 'react-query'
import {
    createBoundQueryFn,
    useBoundQueryFn,
    useBoundResourceQueryFn,
} from '../../../lib/query/useBoundQueryFn'
import { WrapQueryResponse } from '../../../types'
import { OrganisationUnitListItem } from './OrganisationUnitList'
import { replace } from 'lodash'
import { ExpandedState } from '@tanstack/react-table'
import { WrapperComponent } from '@testing-library/react-hooks'
import { useCurrentUserRootOrgUnits } from '../../../lib/user/currentUserStore'
import { PagedResponse } from '../../../types/generated'

const staticOrgUnitFields = [
    'id',
    'access',
    'displayName',
    'level',
    'path',
    'parent',
    //'children~isNotEmpty~rename(hasChildren)',
    'children~size~rename(childCount)',
]
// const orgUnitFields = [
//     'id',
//     'access',
//     'displayName',
//     'level',
//     'path',
//     'parent',
//     'ancestors[id,displayName,level,path,parent,children[id]]',
//     'children[id,displayName,access,parent,level, path,children~isNotEmpty~rename(hasChildren)]',
// ]

const getOrgUnitFieldFilters = (fieldFilters: string[]) => {
    const orgUnitFields = staticOrgUnitFields.concat(fieldFilters)
    const ancestorFields = `ancestors[${orgUnitFields.join()},href]`
    // const childrenFields = `children[${orgUnitFields.join()},children~isNotEmpty~rename(hasChildren)]`
    return orgUnitFields.concat(ancestorFields)
}

type OrganisationUnitResponse = PagedResponse<
    OrganisationUnitListItem,
    'organisationUnits'
>

type OrganisationUnitResponseWithQueryContext = OrganisationUnitResponse & {
    queryContext: {
        parent: string
    }
}

type UseOrganisationUnitOptions = {
    ids: string[]
    fieldFilters: string[]
    filters?: string[]
    enabled?: boolean
}
export const useOrgUnitChildrenQueries = ({
    ids,
    fieldFilters,
    filters,
    enabled,
}: UseOrganisationUnitOptions) => {
    const boundQueryFn = useBoundResourceQueryFn()

    const queryObjects = ids.map((id) => {
        const resourceQuery = {
            resource: 'organisationUnits',
            params: {
                fields: getOrgUnitFieldFilters(fieldFilters),
                filter: `parent.id:eq:${id}`,
                order: 'displayName:asc',
            },
        } //as const
        const options: UseQueryOptions<
            OrganisationUnitResponseWithQueryContext,
            unknown,
            OrganisationUnitResponseWithQueryContext,
            [typeof resourceQuery]
        > = {
            enabled,
            queryKey: [resourceQuery],
            queryFn: (queryOptions) =>
                boundQueryFn<OrganisationUnitResponse>(queryOptions).then(
                    (response) => ({
                        ...response,
                        // queryContext is used to more efficiently keep track of the parent
                        // eg. instead of looping through all orgs, we can loop through the queries to find the parent
                        queryContext: { parent: id },
                    })
                ), // queryFn<OrganisationUnitResponse>,

            // keepPreviousData: true,
            staleTime: 60000,
            cacheTime: 60000,
            meta: { parent: id },
        }
        return options
    })
    // .concat(filterRootQuery)

    const qs = useQueries(queryObjects)
    return qs
    // return qs.map(q => q.data?.queryContext.parent)
}

type useFilteredOrgUnitsOptions = {
    fieldFilters: string[]
    filters: string[]
    enabled?: boolean
}
export const useFilteredOrgUnits = ({
    fieldFilters,
    filters,
    enabled,
}: useFilteredOrgUnitsOptions) => {
    const boundQueryFn = useBoundResourceQueryFn()

    const resourceQuery = {
        resource: 'organisationUnits',
        params: {
            fields: getOrgUnitFieldFilters(fieldFilters),
            //filter: filters, //: expandedFilter,
            query: filters[0],
            withinUserHierarchy: true,
        },
    } //as const
    const options: UseQueryOptions<
        OrganisationUnitResponse,
        unknown,
        OrganisationUnitResponse,
        [typeof resourceQuery]
    > = {
        enabled: enabled,
        queryKey: [resourceQuery],
        queryFn: boundQueryFn,
        // keepPreviousData: true,
        staleTime: 60000,
        cacheTime: 60000,
    }

    return useQuery(options)
}

export type ParentIdToPages = Record<string, number[]>

type UsePaginatedChildrenOrgUnitsOptions = {
    parentIds: string[]
    fieldFilters: string[]
    filters?: string[]
    enabled?: boolean
}

export const usePaginiatedChildrenOrgUnitsController = (
    options: UsePaginatedChildrenOrgUnitsOptions
) => {
    const boundQueryFn = useBoundResourceQueryFn()
    const parentIds = options.parentIds

    // store a "map" of pages to fetch for each parent id
    const [parentIdPages, setFetchPages] = useState<ParentIdToPages>(
        Object.fromEntries(parentIds.map((id) => [id, [1]]))
    )

    // this will create a query for each parent id and each page
    // eg if parentIds = ['a', 'b'] and fetchPages = {a: [1, 2], b: [1]}
    // then queries will be [['a', 1], ['a', 2], ['b', 1]]
    const queries = useMemo(() => {
        const idsToFetch = parentIds.map(
            (id) => [id, parentIdPages[id] || [1]] as const
        )
        console.log({ idsToFetch })
        const ret = idsToFetch.flatMap(([id, pages]) =>
            pages.map((p) => [id, p] as const)
        )
        return ret
    }, [parentIds, parentIdPages])

    const fetchNextPage = useCallback(
        (id: string) => {
            setFetchPages((prev) => {
                const pages = prev[id] || [1]
                return {
                    ...prev,
                    [id]: [...pages, pages[pages.length - 1] + 1],
                }
            })
        },
        [setFetchPages]
    )

    const queryObjects = queries.map(([id, page]) => {
        const resourceQuery = {
            resource: 'organisationUnits',
            params: {
                fields: getOrgUnitFieldFilters(options.fieldFilters),
                filter: `parent.id:eq:${id}`,
                order: 'displayName:asc',
                page: page,
            },
        } //as const
        const queryOptions: UseQueryOptions<
            OrganisationUnitResponse,
            unknown,
            OrganisationUnitResponse,
            [typeof resourceQuery]
        > = {
            enabled: true, // options.enabled,
            queryKey: [resourceQuery],
            queryFn: boundQueryFn,
            // keepPreviousData: true,
            staleTime: 60000,
            cacheTime: 60000,
            meta: { parent: id },
        }
        return queryOptions
    })
    // .concat(filterRootQuery)

    const qs = useQueries(queryObjects)
    return {
        queries: qs,
        fetchNextPage,
    }
}
