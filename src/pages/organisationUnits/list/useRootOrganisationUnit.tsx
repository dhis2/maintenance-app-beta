import { useDataEngine } from '@dhis2/app-runtime'
import { useCallback, useEffect, useMemo } from 'react'
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

const orgUnitFields = [
    'id',
    'access',
    'displayName',
    'level',
    'path',
    'parent',
    'ancestors[id,displayName,level,path,parent,children[id,displayName,level,path,children]]',
    'children[id,displayName,access,parent,level, path,children~isNotEmpty~rename(hasChildren)]',
]
const rootOrgUnitQuery = {
    result: {
        resource: 'organisationUnits',
        params: {
            paging: false,
            fields: orgUnitFields,
            filter: 'level:eq:1',
        },
    },
} as const

type OrganisationUnitResponse = PagedResponse<
    OrganisationUnitListItem,
    'organisationUnits'
>

type OrganisationUnitResponseWithQueryContext = OrganisationUnitResponse & {
    queryContext: {
        parent: string | undefined
    }
}

type UseOrganisationUnitOptions = {
    ids: string[]
    fieldFilters: string[]
    filters?: string[]
}
export const useOrganisationUnits = ({
    ids,
    fieldFilters,
    filters,
}: UseOrganisationUnitOptions) => {
    const boundQueryFn = useBoundResourceQueryFn()
    const rootOrgUnits = useCurrentUserRootOrgUnits()

    const rootOrgUnitsSet = useMemo(
        () => new Set(rootOrgUnits.map((ou) => ou.id)),
        [rootOrgUnits]
    )

    const deduplicatedIds = useMemo(() => {
        console.log({ ids })
        return Array.from(new Set([...ids, ...rootOrgUnitsSet]))
    }, [ids, rootOrgUnitsSet])

    console.log({ deduplicatedIds })
    const queryObjects = deduplicatedIds.map((id) => {
        const isRoot = rootOrgUnitsSet.has(id)
        const expandedFilter = isRoot ? `id:eq:${id}` : `parent.id:eq:${id}`
        const filter = filters && filters.length > 0 ? filters : expandedFilter
        console.log({ filter, filters })
        const resourceQuery = {
            resource: 'organisationUnits',
            params: {
                fields: orgUnitFields.concat(fieldFilters),
                filter,
            },
        } as const
        const options: UseQueryOptions<
            OrganisationUnitResponseWithQueryContext,
            unknown,
            OrganisationUnitResponseWithQueryContext,
            [typeof resourceQuery]
        > = {
            queryKey: [resourceQuery],
            queryFn: (queryOptions) =>
                boundQueryFn<OrganisationUnitResponse>(queryOptions).then(
                    (response) => ({
                        ...response,
                        queryContext: {
                            parent: isRoot ? undefined : id,
                        },
                    })
                ), // queryFn<OrganisationUnitResponse>,

            keepPreviousData: true,
            staleTime: Infinity,
            cacheTime: Infinity,
        }
        return options
    })

    console.log({ queryObjects })
    const qs = useQueries(queryObjects)
    return qs
    // return qs.map(q => q.data?.queryContext.parent)
}

export const useExpandedOrgUnits = (
    {
        expanded,
        fieldFilters,
    }: {
        expanded: ExpandedState
        fieldFilters: string[]
    } = { expanded: {}, fieldFilters: [] }
) => {
    const queryFn = useBoundQueryFn()
    const queryObjects = Object.entries(expanded)
        .filter(
            ([id, expanded], index, arr) =>
                !!expanded && arr.findIndex(([i]) => i === id) === index
        )
        .map(([id, expanded]) => {
            const query = {
                result: {
                    resource: 'organisationUnits',
                    id,
                    params: {
                        fields: orgUnitFields.concat(fieldFilters),
                    },
                },
            } as const
            const options: UseQueryOptions<
                WrapQueryResponse<OrganisationUnitListItem>,
                unknown,
                OrganisationUnitListItem,
                [typeof query]
            > = {
                queryKey: [query],
                queryFn: queryFn<WrapQueryResponse<OrganisationUnitListItem>>,
                select: (data) => ({
                    ...data.result,
                    children: data.result.children?.sort((a, b) =>
                        a.displayName.localeCompare(b.displayName)
                    ),
                }),

                // keepPreviousData: true,
                staleTime: Infinity,
                cacheTime: Infinity,
            }
            return options
        })

    console.log({ queryObjects })
    const qs = useQueries(queryObjects)
    return qs
}
