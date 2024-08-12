import {
    Button,
    Checkbox,
    DataTableCell,
    DataTableRow,
    IconArrowDown16,
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
import React, { useEffect, useMemo, useState } from 'react'
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
import { OrganisationUnit } from '../../../types/generated'
import css from './OrganisationUnitList.module.css'
import {
    useFilteredOrgUnits,
    usePaginiatedChildrenOrgUnitsController,
} from './useOrganisationUnits'

export type OrganisationUnitListItem = Pick<
    OrganisationUnit,
    'id' | 'displayName' | 'access' | 'path' | 'level' | 'parent'
> & {
    ancestors: OrganisationUnitListItem[]
    hasChildren?: boolean
    childCount: number
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
    const schema = useSchema(SchemaName.organisationUnit)

    // the expanded organisationUnit Ids
    // note that this controls which orgUnits we load data for through usePaginatedChildrenOrgUnitsController
    const [expanded, setExpanded] = useState<ExpandedState>(() =>
        Object.fromEntries(userRootOrgUnitIds.map((ouId) => [ouId, true]))
    )

    // we keep a diferent state for the expanded org units during filtering
    // because we want to expand all ancestors - but do NOT want to load data through usePaginatedChildrenOrgUnitsController
    // since we already get the data we need through useFilteredOrgUnits

    const [expandedDuringFilter, setExpandedDuringFilter] =
        useState<ExpandedState>({})

    const fieldFilters = selectedColumns.map((column) =>
        getFieldFilter(schema, column.path)
    )

    const orgUnitFiltered = useFilteredOrgUnits({
        searchQuery: identifiableFilter,
        fieldFilters,
        enabled: !!identifiableFilter,
    })
    const isFiltering = !!identifiableFilter && !orgUnitFiltered.isIdle

    const { queries, fetchNextPage } = usePaginiatedChildrenOrgUnitsController({
        parentIds: Object.keys(expanded),
        fieldFilters,
    })

    // expand ancestors of the filtered org units
    useEffect(() => {
        if (!isFiltering) {
            setExpanded(
                Object.fromEntries(
                    userRootOrgUnitIds.map((ouId) => [ouId, true])
                )
            )
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
    }, [
        userRootOrgUnits,
        isFiltering,
        orgUnitFiltered.data,
        userRootOrgUnitIds,
    ])

    console.log({
        orgUnitFiltered,
        expanded,
        expandedDuringFilter,
    })

    const flatOrgUnits = useMemo(() => {
        //gather all orgUnits and their ancestors and deduplicate them
        const deduplicatedOrgUnits = queries
            .concat(orgUnitFiltered)
            .filter((q) => !!q.data)
            .flatMap((q) => {
                const queryOrgs = q.data.organisationUnits
                const ancestors = queryOrgs.flatMap((ou) => ou.ancestors)
                return [...queryOrgs, ...ancestors]
            })
            .reduce((acc, ou) => {
                acc[ou.id] = ou
                return acc
            }, {} as Record<string, OrganisationUnitListItem>)
        return Object.values(deduplicatedOrgUnits)
    }, [queries, orgUnitFiltered])

    const computedRoot = useMemo(() => {
        return flatOrgUnits.filter(
            (ou) => !ou.parent || userRootOrgUnitIds.includes(ou.id)
        )
    }, [flatOrgUnits, userRootOrgUnitIds])

    const table = useReactTable({
        columns: columnDefinitions,
        // note data must change for table to re-compute
        // thus we have to compute the root whenever data changes (since subrows is not part of the data)
        data: computedRoot,
        getRowId: (row) => row.id,
        getCoreRowModel: getCoreRowModel<OrganisationUnitListItem>(),
        getRowCanExpand: (row) => row.original.childCount > 0,
        getSubRows: (row) => {
            return flatOrgUnits.filter((d) => d.parent?.id === row.id)
        },
        getExpandedRowModel: getExpandedRowModel(),
        onExpandedChange: isFiltering ? setExpandedDuringFilter : setExpanded,
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
                {table.getRowModel().rows.map((row) => (
                    <OrganisationUnitRowSimple
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

const OrganisationUnitRowSimple = ({
    row,
    setExpanded,
    isFiltering,
    fetchNextPage,
}: {
    row: Row<OrganisationUnitListItem>
    setExpanded: React.Dispatch<React.SetStateAction<ExpandedState>>
    isFiltering: boolean
    fetchNextPage: (id: string) => void
}) => {
    const parentRow = row.getParentRow()
    return (
        <>
            <DataTableRow key={row.id}>
                <DataTableCell>
                    <span
                        style={{
                            paddingLeft: `${row.depth * 2}rem`,
                            display: 'flex',
                        }}
                    >
                        {row.getCanExpand() ? (
                            <>
                                {isFiltering &&
                                    row.original.childCount !==
                                        row.subRows.length && (
                                        <Button
                                            secondary
                                            onClick={() => {
                                                setExpanded((prev) => {
                                                    if (prev === true) {
                                                        return prev
                                                    }
                                                    return {
                                                        ...prev,
                                                        [row.id]: prev[row.id]
                                                            ? !prev[row.id]
                                                            : true,
                                                    }
                                                })
                                            }}
                                            icon={<IconArrowDown16 />}
                                        >
                                            Show all
                                        </Button>
                                    )}
                                <Button
                                    className={css.expandButton}
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
                                    onClick={row.getToggleExpandedHandler()}
                                ></Button>
                            </>
                        ) : null}
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
            {!isFiltering &&
                parentRow &&
                parentRow.getIsExpanded() &&
                parentRow.subRows.length !== parentRow?.original.childCount &&
                row === parentRow.subRows[parentRow.subRows.length - 1] && (
                    <DataTableRow>
                        <DataTableCell
                            colSpan="100"
                            style={{ textAlign: 'center' }}
                            onClick={() => fetchNextPage(parentRow.original.id)}
                        >
                            Load more for {parentRow.original.displayName}
                        </DataTableCell>
                    </DataTableRow>
                )}
        </>
    )
}
