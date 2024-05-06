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
import React, { useMemo, useState } from 'react'
import { IdentifiableFilter, SectionList } from '../../../components'
import { useModelListView } from '../../../components/sectionList/listView'
import { ModelValue } from '../../../components/sectionList/modelValue/ModelValue'
import { SectionListHeader } from '../../../components/sectionList/SectionListHeaderNormal'
import { SectionListTitle } from '../../../components/sectionList/SectionListTitle'
import {
    SchemaName,
    useFilterQueryParams,
    useSchema,
    useSchemaFromHandle,
} from '../../../lib'
import { OrganisationUnit } from '../../../types/generated'
import css from './OrganisationUnitList.module.css'
import {
    useExpandedOrgUnits,
    useOrganisationUnits,
} from './useRootOrganisationUnit'
import { useCurrentUserRootOrgUnits } from '../../../lib/user/currentUserStore'
import { getFieldFilter } from '../../../lib/models/path'

export type OrganisationUnitListItem = Pick<
    OrganisationUnit,
    | 'id'
    | 'displayName'
    | 'access'
    | 'children'
    | 'path'
    | 'level'
    | 'parent'
    | 'ancestors'
> & {
    hasChildren?: boolean
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

export const OrganisationUnitList = () => {
    const { columnDefinitions, selectedColumns } = useColumns()
    const filters = useFilterQueryParams()

    const rootOrgUnits = useCurrentUserRootOrgUnits()
    const rootOrgUnitsSet = useMemo(
        () => new Set(rootOrgUnits.map((ou) => ou.id)),
        [rootOrgUnits]
    )
    const schema = useSchema(SchemaName.organisationUnit)

    const [expanded, setExpanded] = useState<ExpandedState>(() =>
        Object.fromEntries(rootOrgUnits.map((ou) => [ou.id, true]))
    )

    const orgUnitQueries = useOrganisationUnits({
        ids: Object.keys(expanded),
        fieldFilters: selectedColumns.map((column) =>
            getFieldFilter(schema, column.path)
        ),
        filters,
    })
    console.log({ orgUnits: orgUnitQueries })
    // const expandedQueries = useExpandedOrgUnits({
    //     expanded: expanded,
    //     fieldFilters: selectedColumns.map((column) =>
    //         getFieldFilter(schema, column.path)
    //     ),
    // })
    // const data = useMemo(
    //     () => expandedQueries.filter((q) => !!q.data).map((q) => q.data!) ?? [],
    //     [expandedQueries]
    // )

    const allOrgUnits = useMemo(
        () =>
            orgUnitQueries
                .filter((q) => !!q.data)
                .flatMap((q) => q.data.organisationUnits!) ?? [],
        [orgUnitQueries]
    )
    const rootData = useMemo(
        () =>
            orgUnitQueries
                .filter((d) => d.data?.queryContext.parent === undefined)
                .flatMap((d) => d.data?.organisationUnits ?? []),
        [orgUnitQueries]
    )

    const flatAncestors = useMemo(() => {
        if (filters.length < 1) {
            return []
        }
        const ancestors = allOrgUnits
            .filter((ou) => ou.ancestors.length > 0)
            .flatMap((ou) => ou.ancestors)
        // .filter((ou) => ou.level === 1)
        return Array.from(new Map(ancestors.map((a) => [a.id, a])).values())
    }, [allOrgUnits, filters])

    const tree =
        filters.length > 0
            ? flatAncestors.filter((a) => a.level === 1)
            : rootData
    console.log({ ddata: allOrgUnits, rootData, tree, flatAncestors })
    const table = useReactTable({
        columns: columnDefinitions,
        // columns
        data: tree ?? [],
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
            if (filters.length > 0) {
                return flatAncestors.filter((ou) => ou.parent?.id === row.id)
                // .map((ou) => ou.children)
            }
            const isRoot = rootOrgUnitsSet.has(row.id)
            if (isRoot) {
                return rootData
                    .filter((d) => d?.id === row.id)
                    .flatMap((d) => d.children)
            }

            return orgUnitQueries
                .filter((q) => q.data?.queryContext.parent === row.id)
                .flatMap((q) => q.data?.organisationUnits ?? [])
            // return ddata
            //     .filter((d) => d?.id === row.id)
            //     .flatMap((d) => d.children)
        },

        getExpandedRowModel: getExpandedRowModel(),
        onExpandedChange: setExpanded,

        state: {
            expanded,
        },
    })

    console.log({
        table,
        data: rootData,
        exp: table.getExpandedRowModel(),
    })
    return (
        <div>
            <SectionListTitle />
            <IdentifiableFilter />
            <SectionListHeader />
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
