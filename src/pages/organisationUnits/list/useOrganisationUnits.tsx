import { useCallback, useMemo, useState } from 'react'
import { useQuery, useQueries, useQueryClient } from 'react-query'
import { useBoundResourceQueryFn } from '../../../lib/query/useBoundQueryFn'
import { OrganisationUnit, PagedResponse } from '../../../types/generated'

const staticOrgUnitFields = [
    'id',
    'access',
    'displayName',
    'level',
    'path',
    'parent',
    'children~size~rename(childCount)',
]

const getOrgUnitFieldFilters = (fieldFilters: string[]) => {
    const orgUnitFields = staticOrgUnitFields.concat(fieldFilters)
    const ancestorFields = `ancestors[${orgUnitFields.join()},href]`
    return orgUnitFields.concat(ancestorFields)
}

export type PartialOrganisationUnit = Pick<
    OrganisationUnit,
    'id' | 'displayName' | 'access' | 'path' | 'level' | 'parent'
> & {
    ancestors: Omit<PartialOrganisationUnit, 'ancestors'>[]
    hasChildren?: boolean
    childCount: number
}

type OrganisationUnitResponse = PagedResponse<
    PartialOrganisationUnit,
    'organisationUnits'
>

type UseFilteredOrgUnitsOptions = {
    fieldFilters: string[]
    searchQuery?: string
    enabled?: boolean
}
export const useFilteredOrgUnits = ({
    fieldFilters,
    searchQuery,
    enabled,
}: UseFilteredOrgUnitsOptions) => {
    const boundQueryFn = useBoundResourceQueryFn()

    const resourceQuery = {
        resource: 'organisationUnits',
        params: {
            fields: getOrgUnitFieldFilters(fieldFilters),
            query: searchQuery,
            withinUserHierarchy: true,
        },
    }

    return useQuery({
        enabled,
        queryKey: [resourceQuery],
        queryFn: boundQueryFn<OrganisationUnitResponse>,
        staleTime: 60000,
        cacheTime: 60000,
        keepPreviousData: true,
    })
}

export type ParentIdToPages = Record<string, number[]>

type UsePaginatedChildrenOrgUnitsOptions = {
    parentIds: Record<string, boolean>
    fieldFilters: string[]
    filters?: string[]
    enabled?: boolean
}

export const usePaginatedChildrenOrgUnitsController = (
    options: UsePaginatedChildrenOrgUnitsOptions
) => {
    const boundQueryFn = useBoundResourceQueryFn()
    const parentIds = options.parentIds
    // store a "map" of pages to fetch for each parent id
    const [parentIdPages, setFetchPages] = useState<ParentIdToPages>(
        Object.fromEntries(Object.keys(parentIds).map((id) => [id, [1]]))
    )

    // this will create a query for each parent id and each page
    // eg if parentIds = ['a', 'b'] and fetchPages = {a: [1, 2], b: [1]}
    // then queries will be [['a', 1], ['a', 2], ['b', 1]]
    const flatParentIdPages = useMemo(() => {
        return Object.keys(parentIds).flatMap((id) => {
            const pages = parentIdPages[id] || [1]
            return pages.map((p) => [id, p] as const)
        })
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

    const queryObjects = flatParentIdPages.map(([id, page]) => {
        const resourceQuery = {
            resource: 'organisationUnits',
            params: {
                fields: getOrgUnitFieldFilters(options.fieldFilters),
                // `id:eq:id` is for an edge-case where a root-unit is a leaf-node
                // and `parent.id`-filter would return empty results
                filter: [`parent.id:eq:${id}`, `id:eq:${id}`],
                rootJunction: 'OR',
                order: 'displayName:asc',
                page: page,
            },
        }
        const queryOptions = {
            enabled: options.enabled,
            queryKey: [resourceQuery],
            queryFn: boundQueryFn<OrganisationUnitResponse>,
            staleTime: 60000,
            cacheTime: 60000,
            meta: { parent: id },
        } as const
        return queryOptions
    })

    const queries = useQueries(queryObjects)

    return {
        queries,
        fetchNextPage,
    }
}
