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
} from '@tanstack/react-table'
import React, { useMemo, useState } from 'react'
import { SectionList } from '../../../components'
import { FilterWrapper } from '../../../components/sectionList/filters/FilterWrapper'
import { useModelListView } from '../../../components/sectionList/listView'
import { ModelValue } from '../../../components/sectionList/modelValue/ModelValue'
import { SectionListHeader } from '../../../components/sectionList/SectionListHeaderNormal'
import { SectionListTitle } from '../../../components/sectionList/SectionListTitle'
import { ModelPropertyDescriptor, useSchemaFromHandle } from '../../../lib'
import { OrganisationUnit } from '../../../types/generated'
import { useExpandedOrgUnits } from './useRootOrganisationUnit'

export type OrganisationUnitListItem = Pick<
    OrganisationUnit,
    'id' | 'displayName' | 'access' | 'children' | 'path' | 'level' | 'parent'
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
    //  const rootQuery = useRootOrganisationUnit()
    //  rootQuery.data

    const { columnDefinitions, selectedColumns } = useColumns()
    //console.log(rootQuery)

    const [expanded, setExpanded] = useState<ExpandedState>({
        //  ImspTQPwCqd: true,
    })
    const headers = columnDefinitions.map((c) => c.header)
    console.log({ expanded })
    const expandedQueries = useExpandedOrgUnits({
        expanded,
        fieldFilters: selectedColumns.map((c) => c.path),
    })
    const data = useMemo(
        () => expandedQueries.filter((q) => !!q.data).map((q) => q.data!) ?? [],
        [expandedQueries]
    )

    const rootData = useMemo(() => data.filter((d) => d.level === 1), [data])

    console.log({ data, rootData })
    const table = useReactTable({
        columns: columnDefinitions,
        data: rootData ?? [],
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
            console.log({ data })
            const dfilter = data
                .filter((d) => d?.id === row.id)
                .flatMap((d) => d.children)
            console.log({ dfilter })
            return dfilter
            return data.filter((d) => d.id === row.id)
            const expandedRows =
                expandedQueries.find((q) => q.data?.result.id === row.id)?.data
                    ?.result.children ?? []

            console.log('subrows', row.children, expandedRows)
            return row.children?.concat(expandedRows)
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
            <FilterWrapper />
            <SectionListHeader />
            {/* <FilterWrapper /> */}
            <SectionList
                allSelected={table.getIsAllRowsSelected()}
                headerColumns={table.getHeaderGroups()[0].headers.map((h) => ({
                    label: h.column.columnDef.header as string,
                    path: h.column.id,
                }))}
                onSelectAll={() => table.toggleAllRowsSelected()}
            >
                {table.getRowModel().rows.map((row) => {
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
                                            secondary
                                            type="button"
                                            loading={
                                                row.getIsExpanded() &&
                                                row.subRows.length < 1
                                            }
                                            icon={
                                                row.getIsExpanded() ? (
                                                    <IconChevronDown16 />
                                                ) : (
                                                    <IconChevronRight16 />
                                                )
                                            }
                                            // onClick={row.getToggleExpandedHandler()}
                                            onClick={() => row.toggleExpanded()}
                                        >
                                            {/* {row.getIsExpanded() &&
                                            row.subRows.length < 1
                                                ? 'loading'
                                                : null} */}
                                        </Button>
                                    ) : null}{' '}
                                    <Checkbox
                                        checked={row.getIsSelected()}
                                        onChange={({ checked }) =>
                                            row.toggleSelected(checked)
                                        }
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
                })}
            </SectionList>
        </div>
    )
}
