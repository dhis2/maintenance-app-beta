import {
    Button,
    Checkbox,
    DataTableCell,
    DataTableRow,
    IconChevronDown16,
    IconChevronRight16,
} from '@dhis2/ui'
import {
    ExpandedState,
    useReactTable,
    getCoreRowModel,
    getExpandedRowModel,
    ColumnDef,
    flexRender,
    Row,
} from '@tanstack/react-table'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { IdentifiableFilter, SectionList } from '../../../components'
import { useModelListView } from '../../../components/sectionList/listView'
import { ModelValue } from '../../../components/sectionList/modelValue/ModelValue'
import { SectionListTitle } from '../../../components/sectionList/SectionListTitle'
import { ToolbarNormal } from '../../../components/sectionList/toolbar/ToolbarNormal'
import {
    SchemaName,
    useFilterQueryParams,
    useSchema,
    useSchemaFromHandle,
} from '../../../lib'
import { getFieldFilter } from '../../../lib/models/path'
import { useCurrentUserRootOrgUnits } from '../../../lib/user/currentUserStore'
import { OrganisationUnit } from '../../../types/generated'
import css from './OrganisationUnitList.module.css'
import {
    useExpandedOrgUnits,
    useOrganisationUnits,
} from './useRootOrganisationUnit'
import { filter } from 'lodash'

export type OrganisationUnitListItem = Pick<
    OrganisationUnit,
    'id' | 'displayName' | 'access' | 'path' | 'level' | 'parent' | 'ancestors'
> & {
    hasChildren?: boolean
    children: OrganisationUnitListItem[]
}

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
                        console.log({ orgin: row.original })
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

const useTreeData = () => {}

export const OrganisationUnitList = () => {
    const { columnDefinitions, selectedColumns } = useColumns()
    const filters = useFilterQueryParams()

    const hasExpandedAfterFilter = React.useRef(false)

    const rootOrgUnits = useCurrentUserRootOrgUnits()
    const minimumOrgUnitLevel = rootOrgUnits[0].level
    const rootOrgUnitsSet = useMemo(
        () => new Set(rootOrgUnits.map((ou) => ou.id)),
        [rootOrgUnits]
    )
    const schema = useSchema(SchemaName.organisationUnit)

    const [expanded, _setExpanded] = useState<ExpandedState>(() =>
        Object.fromEntries(rootOrgUnits.map((ou) => [ou.id, true]))
    )

    const setExpanded: React.Dispatch<React.SetStateAction<ExpandedState>> =
        useCallback(
            (expandedState) => {
                _setExpanded(expandedState)
                hasExpandedAfterFilter.current = true
            },
            [_setExpanded]
        )

    useEffect(() => {
        hasExpandedAfterFilter.current = false
    }, [filters])

    const orgUnitQueries = useOrganisationUnits({
        ids: Object.keys(expanded),
        fieldFilters: selectedColumns.map((column) =>
            getFieldFilter(schema, column.path)
        ),
        filters,
    })

    const allOrgUnitsMap = useMemo(
        () =>
            orgUnitQueries
                .filter((q) => !!q.data)
                .flatMap((q) => {
                    const queryOrgs = q.data.organisationUnits
                    const children = queryOrgs.flatMap((ou) => ou.children)
                    const ancestors = queryOrgs.flatMap((ou) => ou.ancestors)
                    return [...queryOrgs, ...children, ...ancestors]
                })
                .reduce((acc, ou) => {
                    acc[ou.id] = ou
                    return acc
                }, {} as Record<string, OrganisationUnitListItem>),
        [orgUnitQueries]
    )
    const flatOrgUnits = useMemo(
        () => Object.values(allOrgUnitsMap),
        [allOrgUnitsMap]
    )

    const rootData = useMemo(() => {
        const rootInData = flatOrgUnits.filter((d) => d.parent === undefined)
        // .flatMap((d) => d.data?.organisationUnits ?? [])

        if (rootInData.length > 0) {
            return rootInData
        }
        // if we dont have root in data, eg. we might be searching, find the tree root from ancestors
        const rootAncestor = flatOrgUnits
            .filter((ou) => ou?.ancestors?.length > 0)
            .flatMap((ou) => ou.ancestors)
            .filter((ou) => ou.level === minimumOrgUnitLevel)[0]
        console.log({ rootAncestor })
        return rootAncestor //allOrgUnitsMap[rootAncestor?.id]
    }, [minimumOrgUnitLevel, flatOrgUnits])

    console.log({ rootData, flatOrgUnits, allOrgUnitsMap })
    // if we are searching, rootData contain the root of the search, and can be at any level
    // thus we're using the ancestors to build the tree
    const table = useReactTable({
        columns: columnDefinitions,
        // columns
        data: rootData ?? [],
        // paginateExpandedRows
        getRowId: (row) => row.id,
        getCoreRowModel: getCoreRowModel<OrganisationUnitListItem>(),
        getRowCanExpand: (row) => {
            console.log({ row })
            return (
                (!!row.original?.children?.length &&
                    row.original.children.length > 0) ||
                !!row.original.hasChildren
            )
        },
        getSubRows: (row) => {
            // if (row.children) {
            //     return row.children
            // }
            // const isRoot = rootData //rootOrgUnitsSet.has(row.id)
            const rootNode = allOrgUnitsMap[row.id]
            if (rootNode && rootNode.children?.length > 0) {
                return rootNode.children
                // .filter((d) => d?.id === row.id)
                // .flatMap((d) => d.children)
            }
            return flatOrgUnits.filter((d) => d.parent?.id === row.id)
        },

        getExpandedRowModel: getExpandedRowModel(),
        onExpandedChange: setExpanded,
        // getIsRowExpanded(row) {
        //     if (filters.length < 1) {
        //         return expanded[row.id]
        //         // return expanded[row.id]
        //     }

        //     return hasExpandedAfterFilter.current ? expanded[row.id] : true
        //     // return row.getIsAllParentsExpanded()
        // },
        state: {
            expanded,
        },
    })

    console.log({
        table,
        data: rootData,
        exp: table.getExpandedRowModel(),
        expanded,
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
                {table.getRowModel().rows.map((row) => (
                    <OrganisationUnitRowSimple key={row.id} row={row} />
                ))}
            </SectionList>
        </div>
    )
}

// const OrganisationUnitRow = ({ row, filters }: { row: Row<OrganisationUnitListItem> }) => {
//     if(row.)
// }
// const OrganisationUnitRowWithAncestors = (
//     row: Row<OrganisationUnitListItem>
// ) => return

const OrganisationUnitRowSimple = ({
    row,
}: {
    row: Row<OrganisationUnitListItem>
}) => {
    return (
        <DataTableRow key={row.id}>
            <DataTableCell>
                <span
                    style={{
                        paddingLeft: `${row.depth * 2}rem`,
                        display: 'flex',
                    }}
                >
                    {row.getCanExpand() ? (
                        <Button
                            className={css.expandButton}
                            secondary
                            type="button"
                            loading={
                                row.getIsExpanded() && row.subRows.length < 1
                            }
                            icon={
                                row.getIsExpanded() ? (
                                    <IconChevronDown16 />
                                ) : (
                                    <IconChevronRight16 />
                                )
                            }
                            onClick={row.getToggleExpandedHandler()}
                        ></Button>
                    ) : null}{' '}
                    <Checkbox
                        checked={row.getIsSelected()}
                        onChange={({ checked }) => row.toggleSelected(checked)}
                    />
                </span>
            </DataTableCell>
            {row.getVisibleCells().map((cell) => {
                return (
                    <DataTableCell key={cell.id}>
                        {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                        )}
                    </DataTableCell>
                )
            })}
            <DataTableCell>
                {/* <DefaultListActions
            model={row.original}
            onShowDetailsClick={() => undefined}
        /> */}
            </DataTableCell>
        </DataTableRow>
    )
}
