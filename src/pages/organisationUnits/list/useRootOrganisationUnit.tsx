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
} from '../../../lib/query/useBoundQueryFn'
import { WrapQueryResponse } from '../../../types'
import { OrganisationUnitListItem } from './OrganisationUnitList'
import { replace } from 'lodash'
import { ExpandedState } from '@tanstack/react-table'
import { WrapperComponent } from '@testing-library/react-hooks'

const orgUnitFields = [
    'id',
    'access',
    'displayName',
    'level',
    'path',
    'parent',
    'ancestors[id,displayName,level,path]',
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

type OrganisationUnitResponse = WrapQueryResponse<{
    organisationUnits: OrganisationUnitListItem[]
}>

export const useRootOrganisationUnit = () => {
    const dataEngine = useDataEngine()
    const queryClient = useQueryClient()
    const queryFn = useBoundQueryFn()
    const query = useQuery({
        queryKey: [rootOrgUnitQuery],
        queryFn: queryFn<OrganisationUnitResponse>,
        select: (data) => {
            return data.result.organisationUnits // || []
        },
        staleTime: Infinity,
        cacheTime: Infinity,
    })
    return query
}

export const useExpandedOrgUnits = ({
    expanded,
    fieldFilters,
}: {
    expanded: ExpandedState
    fieldFilters: string[]
}) => {
    const rootOrgUnits = useRootOrganisationUnit()

    const queryFn = useBoundQueryFn()
    const queryObjects = Object.entries(expanded)
        .concat(rootOrgUnits.data?.map(({ id }) => [id, true]) ?? [])
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
                        // filter: `parent.id:eq:${id}`,
                        // sort: 'displayName:desc',
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
