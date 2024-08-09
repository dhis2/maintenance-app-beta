import {
    Button,
    Checkbox,
    DataTableCell,
    DataTableRow,
    IconArrowDown16,
    IconArrowLeft16,
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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
    useSectionListFilter,
} from '../../../lib'
import { getFieldFilter } from '../../../lib/models/path'
import { useCurrentUserRootOrgUnits } from '../../../lib/user/currentUserStore'
import { OrganisationUnit } from '../../../types/generated'
import css from './OrganisationUnitList.module.css'
import {
    useFilteredOrgUnits,
    useOrgUnitChildrenQueries,
    useRootOrganisationUnits,
} from './useRootOrganisationUnit'

export type OrganisationUnitListItem = Pick<
    OrganisationUnit,
    'id' | 'displayName' | 'access' | 'path' | 'level' | 'parent' | 'ancestors'
> & {
    hasChildren?: boolean
    childCount: number
}

const useColumns = () => {
    const { columns: selectedColumns } = useModelListView()
    const schema = useSchemaFromHandle()

    const columnDefinitions: ColumnDef<OrganisationUnitListItem>[] = useMemo(
        () =>
            selectedColumns
                .map((descriptor) => {
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
                })
                .concat({
                    header: 'Actions',
                    cell: () => <span>Test</span>,
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
    //const filters = useFilterQueryParams()
    const [queryFilter] = useSectionListFilter('identifiable')

    const userRootOrgUnits = useCurrentUserRootOrgUnits()
    const userRootOrgUnitIds = userRootOrgUnits.map((ou) => ou.id)
    const schema = useSchema(SchemaName.organisationUnit)

    // the expanded organisationUnit Ids
    // note that this controls which orgUnits we load data for through useOrgUnitChildrenQueries
    const [expanded, setExpanded] = useState<ExpandedState>(() =>
        Object.fromEntries(userRootOrgUnitIds.map((ouId) => [ouId, true]))
    )

    // we keep a diferent state for the expanded org units during filtering
    // because we want to expand all ancestors - but do NOT want to load data through useOrgUnitChildrenQueries
    // since we already get the data we need through useFilteredOrgUnits

    const [expandedDuringFilter, setExpandedDuringFilter] =
        useState<ExpandedState>({})

    const fieldFilters = selectedColumns.map((column) =>
        getFieldFilter(schema, column.path)
    )

    const orgUnitFiltered = useFilteredOrgUnits({
        filters: [queryFilter || ''],
        fieldFilters,
        enabled: !!queryFilter,
    })
    const isFiltering = !!queryFilter && !orgUnitFiltered.isIdle

    const orgUnitQueries = useOrgUnitChildrenQueries({
        ids: Object.keys(expanded).concat(
            !isFiltering ? userRootOrgUnitIds : []
        ),
        fieldFilters,
    })

    const mergedExpanded = useMemo(() => {
        if (expanded === true || expandedDuringFilter === true) {
            return true
        }
        return { ...expanded, ...expandedDuringFilter }
    }, [expanded, expandedDuringFilter])

    // expand ancestors of the filtered org units
    useEffect(() => {
        if (!isFiltering) {
            setExpanded(
                Object.fromEntries(
                    userRootOrgUnitIds.map((ouId) => [ouId, true])
                )
            )
            //setExpanded(table.initialState.expanded)
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
    }, [userRootOrgUnits, isFiltering, orgUnitFiltered.data])

    console.log({
        orgUnitFiltered,
        orgUnitQueries,
        expanded,
        mergedExpanded,
        expandedDuringFilter,
    })

    const allOrgUnitsMap = useMemo(
        () =>
            orgUnitQueries
                .concat(orgUnitFiltered)
                .filter((q) => !!q.data)
                .flatMap((q) => {
                    const queryOrgs = q.data.organisationUnits
                    //      const children = queryOrgs.flatMap((ou) => ou.children)
                    const ancestors = queryOrgs.flatMap((ou) => ou.ancestors)
                    return [...queryOrgs, ...ancestors]
                })
                .reduce((acc, ou) => {
                    acc[ou.id] = ou
                    return acc
                }, {} as Record<string, OrganisationUnitListItem>),
        [orgUnitQueries, orgUnitFiltered]
    )
    const flatOrgUnits = useMemo(
        () => Object.values(allOrgUnitsMap),
        [allOrgUnitsMap]
    )

    const computedRoot = useMemo(() => {
        return flatOrgUnits.filter(
            (ou) => !ou.parent || userRootOrgUnitIds.includes(ou.id)
        )
    }, [flatOrgUnits, userRootOrgUnitIds])

    console.log({ orgUnitQueries })
    // if we are searching, rootData contain the root of the search, and can be at any level
    // thus we're using the ancestors to build the tree
    const table = useReactTable({
        columns: columnDefinitions,
        // note data must change for table to re-compute
        // thus we cant use the same object from a query that grabs the root
        data: computedRoot,
        // paginateExpandedRows
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

    console.log({
        table,
        exp: table.getExpandedRowModel(),
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
                    />
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
    setExpanded,
    isFiltering,
}: {
    row: Row<OrganisationUnitListItem>
    setExpanded: React.Dispatch<React.SetStateAction<ExpandedState>>
    isFiltering: boolean
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
                        <>
                            {isFiltering &&
                                row.original.childCount !==
                                    row.subRows.length && (
                                    <Button
                                        secondary
                                        onClick={() => {
                                            setExpanded((prev) => ({
                                                ...prev,
                                                [row.id]: prev[row.id]
                                                    ? !prev[row.id]
                                                    : true,
                                            }))
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
                                    false
                                    // row.getIsExpanded() && row.subRows.length < 1
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
