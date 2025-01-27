import {
    ColumnDef,
    ExpandedState,
    ExpandedStateList,
    getCoreRowModel,
    getExpandedRowModel,
    Updater,
    useReactTable,
} from '@tanstack/react-table'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { IdentifiableFilter, SectionList } from '../../../components'
import {
    DefaultDetailsPanelContent,
    DetailsPanel,
} from '../../../components/sectionList/detailsPanel'
import { useModelListView } from '../../../components/sectionList/listView'
import { ModelValue } from '../../../components/sectionList/modelValue/ModelValue'
import { SectionListTitle } from '../../../components/sectionList/SectionListTitle'
import { Toolbar } from '../../../components/sectionList/toolbar'
import { TranslationDialog } from '../../../components/sectionList/translation'
import {
    BaseListModel,
    SchemaName,
    useSchema,
    useSectionListFilter,
} from '../../../lib'
import { getFieldFilter } from '../../../lib/models/path'
import { useCurrentUserRootOrgUnits } from '../../../lib/user/currentUserStore'
import css from './OrganisationUnitList.module.css'
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
    const schema = useSchema(SchemaName.organisationUnit)

    const columnDefinitions = useMemo(
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
                    meta: {
                        fieldFilter: getFieldFilter(schema, descriptor.path),
                    },
                } satisfies ColumnDef<OrganisationUnitListItem>
            }),
        [selectedColumns, schema]
    )

    return columnDefinitions
}

export const OrganisationUnitList = () => {
    const columnDefinitions = useColumns()
    const [identifiableFilter] = useSectionListFilter('identifiable')
    const userRootOrgUnits = useCurrentUserRootOrgUnits()

    const initialExpandedState = useMemo(() => {
        return Object.fromEntries(userRootOrgUnits.map((ou) => [ou.id, true]))
    }, [userRootOrgUnits])

    const [parentIdsToLoad, setParentIdsToLoad] = useState<ExpandedStateList>(
        () => initialExpandedState
    )
    // the expanded organisationUnit Ids
    const [expanded, setExpanded] = useState<ExpandedState>(
        () => initialExpandedState
    )

    const [detailsId, setDetailsId] = useState<string | undefined>()
    const [translationDialogModel, setTranslationDialogModel] = useState<
        BaseListModel | undefined
    >(undefined)

    const handleDetailsClick = useCallback(
        ({ id }: BaseListModel) => {
            setDetailsId((prevDetailsId) =>
                prevDetailsId === id ? undefined : id
            )
        },
        [setDetailsId]
    )

    const fieldFilters = columnDefinitions.map(
        (column) => column.meta.fieldFilter
    )

    const { queries, fetchNextPage } = usePaginatedChildrenOrgUnitsController({
        parentIds: parentIdsToLoad,
        fieldFilters,
    })
    const isFiltering = !!identifiableFilter
    const hasErrored = queries.some((query) => query.isError)

    const orgUnitFiltered = useFilteredOrgUnits({
        searchQuery: identifiableFilter,
        fieldFilters,
        enabled: isFiltering,
    })

    // expand ancestors of the filtered org units
    useEffect(() => {
        // reset state when not filtering
        if (!isFiltering) {
            setExpanded(initialExpandedState)
            setParentIdsToLoad(initialExpandedState)
            return
        }
        // if we are filtering, expand all, and reset parentIdsToLoad
        setExpanded(true)
        // hide data from usePaginatedChildrenOrgUnitsController
        setParentIdsToLoad({})
    }, [isFiltering, initialExpandedState])

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
                if (initialExpandedState[ou.id]) {
                    rootOrgUnits.set(ou.id, ou)
                }
                acc[ou.id] = ou
                return acc
            }, {} as Record<string, OrganisationUnitListItem>)

        return {
            rootOrgUnits: Array.from(rootOrgUnits.values()),
            flatOrgUnits: Object.values(deduplicatedOrgUnits),
        }
    }, [queries, orgUnitFiltered, initialExpandedState])

    const handleExpand = useCallback(
        (valueOrUpdater: Updater<ExpandedState>) => {
            // when we expand something and are not filtering, we need to load the children
            // also translate expandedState === true (expand all) to expand all loaded units
            const getAllExpanded = () =>
                Object.fromEntries(flatOrgUnits.map((ou) => [ou.id, true]))
            // we always want to keep root loaded
            const getValueWithRoot = (value: ExpandedStateList) => ({
                ...initialExpandedState,
                ...value,
            })
            if (typeof valueOrUpdater === 'function') {
                setExpanded((old) => {
                    const value = valueOrUpdater(old)
                    if (!isFiltering) {
                        setParentIdsToLoad(
                            value === true
                                ? getAllExpanded()
                                : getValueWithRoot(value)
                        )
                    }
                    return value
                })
            } else {
                setExpanded(valueOrUpdater)
                if (!isFiltering) {
                    setParentIdsToLoad(
                        valueOrUpdater === true
                            ? getAllExpanded()
                            : getValueWithRoot(valueOrUpdater)
                    )
                }
            }
        },
        [isFiltering, setExpanded, flatOrgUnits, initialExpandedState]
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
            expanded,
        },
        enableSubRowSelection: false,
    })

    return (
        <div>
            <SectionListTitle />
            <IdentifiableFilter />
            <div className={css.listDetailsWrapper}>
                <Toolbar
                    selectedModels={
                        new Set(
                            table
                                .getSelectedRowModel()
                                .flatRows.map((r) => r.id)
                        )
                    }
                    onDeselectAll={() => {
                        table.resetRowSelection(true)
                    }}
                />
                <SectionList
                    headerColumns={table
                        .getHeaderGroups()[0]
                        .headers.map((h) => ({
                            label: h.column.columnDef.header as string,
                            path: h.column.id,
                        }))}
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
                            onShowDetailsClick={handleDetailsClick}
                            isFiltering={isFiltering}
                            hasErrored={hasErrored}
                            fetchNextPage={fetchNextPage}
                            onOpenTranslationClick={setTranslationDialogModel}
                        />
                    ))}
                </SectionList>
                {detailsId && (
                    <DetailsPanel
                        onClose={() => setDetailsId(undefined)}
                        // reset component state when modelId changes
                        key={detailsId}
                    >
                        <DefaultDetailsPanelContent modelId={detailsId} />
                    </DetailsPanel>
                )}
                {translationDialogModel && (
                    <TranslationDialog
                        model={translationDialogModel}
                        onClose={() => setTranslationDialogModel(undefined)}
                    />
                )}
            </div>
        </div>
    )
}
