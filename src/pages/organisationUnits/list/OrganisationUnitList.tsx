import {
    Button,
    Checkbox,
    DataTable,
    DataTableCell,
    DataTableRow,
    IconChevronDown16,
    IconChevronRight16,
} from '@dhis2/ui'
import {
    Column,
    Table,
    ExpandedState,
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getExpandedRowModel,
    ColumnDef,
    flexRender,
} from '@tanstack/react-table'
import React, { useMemo, useState } from 'react'
import { SectionList, SectionListRow } from '../../../components'
import { FilterWrapper } from '../../../components/sectionList/filters/FilterWrapper'
import { DefaultListActions } from '../../../components/sectionList/listActions'
import { SectionListTitle } from '../../../components/sectionList/SectionListTitle'
import { OrganisationUnit } from '../../../types/generated'
import {
    UseRootOrganisationUnit,
    useExpandedOrgUnits,
    useRootOrganisationUnit,
} from './useRootOrganisationUnit'

type PartialChildren = Partial<Pick<OrganisationUnit, 'children'>>
export type OrganisationUnitListItem = Pick<
    OrganisationUnit,
    'id' | 'displayName' | 'access' | 'children' | 'path' | 'level' | 'parent'
> & {
    hasChildren?: boolean
}

const useColumns = () => {
    const columns: ColumnDef<OrganisationUnitListItem>[] = [
        // {
        //     id: 'checkbox',
        //     // accessorKey: 'checkbox',
        //     header: ({ table }) => (
        //         <Checkbox
        //             checked={table.getIsAllRowsSelected()}
        //             onChange={() => table.getToggleAllRowsSelectedHandler()}
        //         />
        //     ),
        // },
        {
            header: 'DisplayName',
            accessorKey: 'displayName',
            cell: ({ row, getValue }) => getValue<string>(),
        },
        {
            accessorKey: 'id',
            header: 'id',
            cell: (cell) => cell.getValue(),
        },
    ]

    return columns
}

export const OrganisationUnitList = () => {
    //  const rootQuery = useRootOrganisationUnit()
    //  rootQuery.data
    const columns = useColumns()
    //console.log(rootQuery)

    const [expanded, setExpanded] = useState<ExpandedState>({
        //  ImspTQPwCqd: true,
    })

    console.log({ expanded })
    const expandedQueries = useExpandedOrgUnits({ expanded })
    const data = useMemo(
        () =>
            expandedQueries.filter((q) => q.isSuccess).map((q) => q.data!) ??
            [],
        [expandedQueries]
    )

    const rootData = useMemo(() => data.filter((d) => d.level === 1), [data])

    console.log({ data, rootData })
    const table = useReactTable({
        columns,
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
                                            icon={
                                                row.getIsExpanded() ? (
                                                    <IconChevronDown16 />
                                                ) : (
                                                    <IconChevronRight16 />
                                                )
                                            }
                                            // onClick={row.getToggleExpandedHandler()}
                                            onClick={() => row.toggleExpanded()}
                                        />
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
