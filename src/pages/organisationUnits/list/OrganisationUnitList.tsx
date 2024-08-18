import {
    ColumnDef,
    ExpandedState,
    ExpandedStateList,
    Updater,
    getCoreRowModel,
    getExpandedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { IdentifiableFilter, SectionList } from '../../../components'
import { useModelListView } from '../../../components/sectionList/listView'
import { ModelValue } from '../../../components/sectionList/modelValue/ModelValue'
import { SectionListTitle } from '../../../components/sectionList/SectionListTitle'
import { ToolbarNormal } from '../../../components/sectionList/toolbar/ToolbarNormal'
import {
    SchemaName,
    useSchema,
    useSchemaFromHandle,
    useSectionListFilter,
} from '../../../lib'
import { getFieldFilter } from '../../../lib/models/path'
import { useCurrentUserRootOrgUnits } from '../../../lib/user/currentUserStore'
import { OrganisationUnitListMessage } from './OrganisationUnitListMessage'
import { OrganisationUnitRow } from './OrganisationUnitRow'
import {
    PartialOrganisationUnit,
    useFilteredOrgUnits,
    usePaginatedChildrenOrgUnitsController,
} from './useOrganisationUnits'

export type OrganisationUnitListItem = Omit<
    PartialOrganisationUnit,
    'ancestors'
>

const useColumns = () => {
    const { columns: selectedColumns } = useModelListView()
    const schema = useSchemaFromHandle()

    const columnDefinitions: ColumnDef<OrganisationUnitListItem>[] = useMemo(
        () =>
            selectedColumns.map((descriptor) => {
                return {
                    accessorKey: descriptor.path,
                    header: descriptor.label,
                    cell: ({ row }) => {
                        return (
                            <ModelValue
                                path={
                                    descriptor.path === 'name'
                                        ? 'displayName'
                                        : descriptor.path
                                }
                                schema={schema}
                                sectionModel={row.original}
                            />
                        )
                    },
                }
            }),
        [selectedColumns, schema]
    )

    return {
        columnDefinitions,
        selectedColumns,
    }
}

export const OrganisationUnitList = () => {
    const { columnDefinitions, selectedColumns } = useColumns()
    const [identifiableFilter] = useSectionListFilter('identifiable')

    const userRootOrgUnits = useCurrentUserRootOrgUnits()
    const userRootOrgUnitIds = useMemo(
        () => userRootOrgUnits.map((ou) => ou.id),
        [userRootOrgUnits]
    )
    const inititalExpandedState = useMemo(() => {
        return Object.fromEntries(
            userRootOrgUnitIds.map((ouId) => [ouId, true])
        )
    }, [userRootOrgUnitIds])
    const schema = useSchema(SchemaName.organisationUnit)

    // the expanded organisationUnit Ids
    // note that this controls which orgUnits we load data for through usePaginatedChildrenOrgUnitsController
    const [expanded, setExpanded] = useState<ExpandedStateList>(
        () => inititalExpandedState
    )

    // we keep a diferent state for the expanded org units during filtering
    // because we want to expand all ancestors - but do NOT want to load data through usePaginatedChildrenOrgUnitsController
    // since we already get the data we need through useFilteredOrgUnits
    const [expandedDuringFilter, setExpandedDuringFilter] =
        useState<ExpandedStateList>({})

    const fieldFilters = selectedColumns.map((column) =>
        getFieldFilter(schema, column.path)
    )

    const orgUnitFiltered = useFilteredOrgUnits({
        searchQuery: identifiableFilter,
        fieldFilters,
        enabled: !!identifiableFilter,
    })
    const isFiltering = !!identifiableFilter

    const parentIdsToLoad = useMemo(() => {
        if (isFiltering) {
            return Object.keys(expanded)
        }
        // when we are not filtering we always want to load the root org units, so that the table is never empty
        return Object.keys({ ...inititalExpandedState, ...expanded })
    }, [isFiltering, expanded, inititalExpandedState])

    const { queries, fetchNextPage } = usePaginatedChildrenOrgUnitsController({
        parentIds: parentIdsToLoad,
        fieldFilters,
    })

    // expand ancestors of the filtered org units
    useEffect(() => {
        if (!isFiltering) {
            setExpanded(inititalExpandedState)
            return
        }
        if (!orgUnitFiltered.data) {
            return
        }
        const ancestorIds = orgUnitFiltered.data?.organisationUnits.flatMap(
            (ou) => ou.ancestors.map((a) => a.id)
        )
        if (!ancestorIds) {
            return
        }
        const expandedObj = Object.fromEntries(
            ancestorIds.map((id) => [id, true])
        )
        setExpandedDuringFilter(expandedObj)
        // this will "hide" data from useOrgUnitChildrenQueries, and only show the relevant data for the filter
        setExpanded({})
    }, [isFiltering, orgUnitFiltered.data, inititalExpandedState])

    const { rootOrgUnits, flatOrgUnits } = useMemo(() => {
        const rootOrgUnits = new Map<string, OrganisationUnitListItem>()
        //gather all loaded orgUnits and their ancestors and deduplicate them
        const deduplicatedOrgUnits = queries
            .concat(orgUnitFiltered)
            .flatMap((q) => {
                if (!q.data) {
                    return []
                }
                const queryOrgs = q.data.organisationUnits ?? []
                const ancestors = queryOrgs.flatMap((ou) => ou.ancestors)
                return [...queryOrgs, ...ancestors]
            })
            .reduce((acc, ou) => {
                if (userRootOrgUnitIds.includes(ou.id)) {
                    rootOrgUnits.set(ou.id, ou)
                }
                acc[ou.id] = ou
                return acc
            }, {} as Record<string, OrganisationUnitListItem>)

        return {
            rootOrgUnits: Array.from(rootOrgUnits.values()),
            flatOrgUnits: Object.values(deduplicatedOrgUnits),
        }
    }, [queries, orgUnitFiltered, userRootOrgUnitIds])

    // handle when expanded
    const handleExpand = useCallback(
        (valueOrUpdater: Updater<ExpandedState>) => {
            // we are just using ExpandedStateList in state, because we need the exact Ids to load
            // but API exposes ExpandedState (includes true to expand all)
            // so we handle and translate that to expand all loaded units
            const setExpandedFunc = isFiltering
                ? setExpandedDuringFilter
                : setExpanded
            const expandAll = () =>
                Object.fromEntries(
                    flatOrgUnits.map((ou) => [ou.id, true] as const)
                )
            if (typeof valueOrUpdater === 'function') {
                setExpandedFunc((old) => {
                    const value = valueOrUpdater(old)
                    return value === true ? expandAll() : value
                })
            } else {
                setExpandedFunc(
                    valueOrUpdater === true ? expandAll() : valueOrUpdater
                )
            }
        },
        [isFiltering, setExpandedDuringFilter, setExpanded, flatOrgUnits]
    )

    const table = useReactTable({
        columns: columnDefinitions,
        // note data must change for table to re-compute
        // thus we have to compute the root whenever data changes (since subrows is not part of the data)
        data: rootOrgUnits,
        getRowId: (row) => row.id,
        getCoreRowModel: getCoreRowModel<OrganisationUnitListItem>(),
        getRowCanExpand: (row) => row.original.childCount > 0,
        getSubRows: (row) => {
            return flatOrgUnits.filter((d) => d.parent?.id === row.id)
        },
        getExpandedRowModel: getExpandedRowModel(),
        onExpandedChange: handleExpand,
        state: {
            expanded: isFiltering ? expandedDuringFilter : expanded,
        },
    })

    return (
        <div>
            <SectionListTitle />
            <IdentifiableFilter />
            <ToolbarNormal />
            <SectionList
                allSelected={table.getIsAllRowsSelected()}
                headerColumns={table.getHeaderGroups()[0].headers.map((h) => ({
                    label: h.column.columnDef.header as string,
                    path: h.column.id,
                }))}
                onSelectAll={() => table.toggleAllRowsSelected()}
            >
                <OrganisationUnitListMessage
                    isFiltering={isFiltering}
                    queries={queries.concat(orgUnitFiltered)}
                    orgUnitCount={table.getRowCount()}
                />
                {table.getRowModel().rows.map((row) => (
                    <OrganisationUnitRow
                        key={row.id}
                        row={row}
                        setExpanded={setExpanded}
                        isFiltering={isFiltering}
                        fetchNextPage={fetchNextPage}
                    />
                ))}
            </SectionList>
        </div>
    )
}
