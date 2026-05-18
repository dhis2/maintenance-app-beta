import { useAlert, useDataEngine, useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Box,
    Button,
    ButtonStrip,
    CircularLoader,
    DataTable,
    DataTableCell,
    DataTableColumnHeader,
    DataTableRow,
    DataTableSortDirection,
    FlyoutMenu,
    IconDelete16,
    IconDuplicate16,
    IconEdit16,
    IconInfo16,
    IconShare16,
    MenuItem,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    MultiSelect,
    MultiSelectOption,
    NoticeBox,
    Popover,
    SharingDialog,
    TableBody,
    TableHead,
    Tooltip,
} from '@dhis2/ui'
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import React, { useEffect, useRef, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSidebarLinks } from '../../app/sidebar/SidebarLinks'
import { IdentifiableFilter } from '../../components'
import { ClientDateTime } from '../../components/date'
import { Loader } from '../../components/loading'
import {
    DetailItem,
    DetailsList,
    DetailsPanelButtons,
    DetailsPanelContent,
} from '../../components/sectionList/detailsPanel'
import { DetailsPanel } from '../../components/sectionList/detailsPanel/DetailsPanel'
import {
    ListActions,
    ActionShowDetails,
} from '../../components/sectionList/listActions/SectionListActions'
import { SectionListLoader } from '../../components/sectionList/SectionListLoader'
import {
    SectionListEmpty,
    SectionListError,
} from '../../components/sectionList/SectionListMessages'
import {
    parseAccessString,
    SCHEMA_SECTIONS,
    getSectionPath,
    SchemaName,
    TOOLTIPS,
    useSectionListFilter,
    useSchemas,
} from '../../lib'
import type { Schema } from '../../lib'
import css from './ListOfAll.module.css'

// ---- types ----

type ListItem = {
    id: string
    displayName: string
    lastUpdated?: string
    sharing?: { public?: string }
    access: { write: boolean; delete: boolean; [key: string]: unknown }
}

type Pager = { page: number; pageCount: number; total: number }
type SchemaQueryResult = {
    result: { pager: Pager } & Record<string, ListItem[]>
}

type ActiveModel = { model: ListItem; schema: Schema }

const PAGE_SIZE = 5

const SCHEMA_NAME_TO_SECTION = Object.fromEntries(
    Object.values(SCHEMA_SECTIONS).map((s) => [s.name, s])
) as Record<string, (typeof SCHEMA_SECTIONS)[keyof typeof SCHEMA_SECTIONS]>

type DataEngine = ReturnType<typeof useDataEngine>

// ---- helpers ----

const getPublicAccessLabel = (value: string | undefined): string => {
    if (!value) {
        return ''
    }
    const parsed = parseAccessString(value)
    if (!parsed) {
        return value
    }
    if (parsed.metadata.write) {
        return i18n.t('Public can edit')
    }
    if (parsed.metadata.read) {
        return i18n.t('Public can view')
    }
    return i18n.t('Public cannot access')
}

const getSectionPathForSchema = (schemaName: SchemaName): string => {
    const section = SCHEMA_NAME_TO_SECTION[schemaName]
    return section ? getSectionPath(section) : schemaName
}

// ---- delete action ----

const ListOfAllDeleteAction = ({
    model,
    schema,
    onDeleteSuccess,
    onCancel,
}: {
    model: ListItem
    schema: Schema
    onDeleteSuccess: () => void
    onCancel: () => void
}) => {
    const engine = useDataEngine()
    const [showConfirm, setShowConfirm] = useState(false)

    const { show: showSuccess } = useAlert(
        () =>
            i18n.t('Successfully deleted "{{name}}"', {
                name: model.displayName,
            }),
        { success: true }
    )

    const deleteMutation = useMutation({
        mutationFn: () =>
            engine.mutate({
                resource: schema.plural,
                id: model.id,
                type: 'delete',
            }) as unknown as Promise<void>,
        onSuccess: () => {
            showSuccess()
            setShowConfirm(false)
            onDeleteSuccess()
        },
    })

    return (
        <>
            <MenuItem
                dense
                destructive
                disabled={!model.access?.delete}
                label={i18n.t('Delete')}
                icon={<IconDelete16 />}
                onClick={() => setShowConfirm(true)}
            />
            {showConfirm && (
                <Modal>
                    <ModalTitle>{i18n.t('Confirm deletion')}</ModalTitle>
                    {deleteMutation.isError && (
                        <ModalContent>
                            <NoticeBox error title={i18n.t('Deletion failed')}>
                                {i18n.t('Could not delete "{{name}}".', {
                                    name: model.displayName,
                                })}
                            </NoticeBox>
                        </ModalContent>
                    )}
                    <ModalActions>
                        <ButtonStrip>
                            <Button
                                destructive
                                disabled={deleteMutation.isLoading}
                                onClick={() => deleteMutation.mutate()}
                            >
                                {deleteMutation.isLoading && (
                                    <CircularLoader extrasmall />
                                )}
                                {deleteMutation.isError
                                    ? i18n.t('Try again')
                                    : i18n.t('Confirm deletion')}
                            </Button>
                            <Button
                                disabled={deleteMutation.isLoading}
                                onClick={() => {
                                    setShowConfirm(false)
                                    onCancel()
                                }}
                            >
                                {i18n.t('Cancel')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </>
    )
}

// ---- item 3-dot menu ----

const ListOfAllItemMore = ({
    model,
    schema,
    onShowDetails,
    onOpenSharing,
    onDeleteSuccess,
}: {
    model: ListItem
    schema: Schema
    onShowDetails: () => void
    onOpenSharing: () => void
    onDeleteSuccess: () => void
}) => {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()
    const sectionPath = getSectionPathForSchema(schema.singular)
    const editable = !!model.access?.write
    const section = SCHEMA_NAME_TO_SECTION[schema.singular]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const duplicable = !!(section as any)?.duplicable

    return (
        <div ref={ref}>
            <Button
                small
                secondary
                onClick={() => setOpen((o) => !o)}
                dataTest="row-actions-menu-button"
                icon={
                    <svg
                        width="22"
                        height="24"
                        viewBox="0 0 22 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M6 11C6.55228 11 7 11.4477 7 12C7 12.5523 6.55228 13 6 13C5.44772 13 5 12.5523 5 12C5 11.4477 5.44772 11 6 11ZM11 11C11.5523 11 12 11.4477 12 12C12 12.5523 11.5523 13 11 13C10.4477 13 10 12.5523 10 12C10 11.4477 10.4477 11 11 11ZM16 11C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13C15.4477 13 15 12.5523 15 12C15 11.4477 15.4477 11 16 11Z"
                            fill="#6C7787"
                        />
                    </svg>
                }
            />
            {open && (
                <Popover
                    arrow={false}
                    placement="bottom-end"
                    reference={ref}
                    onClickOutside={() => setOpen(false)}
                    dataTest="row-actions-menu"
                >
                    <FlyoutMenu>
                        <Tooltip
                            content={TOOLTIPS.noEditAccess}
                            openDelay={800}
                        >
                            <MenuItem
                                dense
                                disabled={!editable}
                                label={i18n.t('Edit')}
                                icon={<IconEdit16 />}
                                onClick={() => {
                                    navigate(`/${sectionPath}/${model.id}`)
                                    setOpen(false)
                                }}
                            />
                        </Tooltip>
                        {duplicable && (
                            <Tooltip
                                content={TOOLTIPS.noDuplicateAccess}
                                openDelay={800}
                            >
                                <MenuItem
                                    dense
                                    disabled={!editable}
                                    label={i18n.t('Duplicate')}
                                    icon={<IconDuplicate16 />}
                                    onClick={() => {
                                        navigate(
                                            `/${sectionPath}/duplicate?duplicatedId=${model.id}`
                                        )
                                        setOpen(false)
                                    }}
                                />
                            </Tooltip>
                        )}
                        <MenuItem
                            dense
                            label={i18n.t('Show details')}
                            icon={<IconInfo16 />}
                            onClick={() => {
                                onShowDetails()
                                setOpen(false)
                            }}
                        />
                        {schema.shareable && (
                            <Tooltip
                                content={TOOLTIPS.noEditAccess}
                                openDelay={800}
                            >
                                <MenuItem
                                    dense
                                    disabled={!editable}
                                    label={i18n.t('Sharing settings')}
                                    icon={<IconShare16 />}
                                    onClick={() => {
                                        onOpenSharing()
                                        setOpen(false)
                                    }}
                                />
                            </Tooltip>
                        )}
                        <ListOfAllDeleteAction
                            model={model}
                            schema={schema}
                            onDeleteSuccess={() => {
                                onDeleteSuccess()
                                setOpen(false)
                            }}
                            onCancel={() => setOpen(false)}
                        />
                    </FlyoutMenu>
                </Popover>
            )}
        </div>
    )
}

// ---- item actions ----

const ListOfAllItemActions = ({
    model,
    schema,
    onShowDetails,
    onOpenSharing,
    onDeleteSuccess,
}: {
    model: ListItem
    schema: Schema
    onShowDetails: () => void
    onOpenSharing: () => void
    onDeleteSuccess: () => void
}) => (
    <ListActions>
        <ActionShowDetails onClick={onShowDetails} />
        <ListOfAllItemMore
            model={model}
            schema={schema}
            onShowDetails={onShowDetails}
            onOpenSharing={onOpenSharing}
            onDeleteSuccess={onDeleteSuccess}
        />
    </ListActions>
)

// ---- details panel content ----

const detailFields = [
    'id',
    'displayName',
    'displayShortName',
    'code',
    'created',
    'lastUpdated',
    'lastUpdatedBy',
    'createdBy',
    'href',
    'access',
] as const

const ListOfAllDetailsPanelContent = ({
    modelId,
    schema,
}: {
    modelId: string
    schema: Schema
}) => {
    const queryRef = useRef({
        result: {
            resource: schema.plural,
            id: modelId,
            params: {
                fields: detailFields
                    .filter((f) => !!schema.properties[f])
                    .concat('id'),
            },
        },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryResponse = useDataQuery<any>(queryRef.current)
    const canEdit = !!queryResponse.data?.result?.access?.write

    return (
        <Loader queryResponse={queryResponse}>
            <DetailsPanelContent
                displayName={queryResponse.data?.result?.displayName ?? ''}
            >
                <DetailsPanelButtons modelId={modelId} editable={canEdit} />
                <DetailsList>
                    {queryResponse.data?.result?.displayShortName && (
                        <DetailItem label={i18n.t('Short name')}>
                            {queryResponse.data.result.displayShortName}
                        </DetailItem>
                    )}
                    <DetailItem label={i18n.t('Code')}>
                        {queryResponse.data?.result?.code}
                    </DetailItem>
                    <DetailItem label={i18n.t('Created by')}>
                        {queryResponse.data?.result?.createdBy?.displayName}
                    </DetailItem>
                    <DetailItem label={i18n.t('Created')}>
                        <ClientDateTime
                            value={queryResponse.data?.result?.created}
                        />
                    </DetailItem>
                    <DetailItem label={i18n.t('Last updated by')}>
                        {queryResponse.data?.result?.lastUpdatedBy
                            ?.displayName ??
                            queryResponse.data?.result?.createdBy?.displayName}
                    </DetailItem>
                    <DetailItem label={i18n.t('Last updated')}>
                        <ClientDateTime
                            value={queryResponse.data?.result?.lastUpdated}
                        />
                    </DetailItem>
                    <DetailItem label={i18n.t('Id')}>
                        {queryResponse.data?.result?.id}
                    </DetailItem>
                </DetailsList>
            </DetailsPanelContent>
        </Loader>
    )
}

// ---- schema accordion ----

const SchemaAccordionRows = ({
    schema,
    engine,
    filter,
    sortOrder,
    onShowDetails,
    onOpenSharing,
    onDeleteSuccess,
}: {
    schema: Schema
    engine: DataEngine
    filter: string | undefined
    sortOrder: [string, 'asc' | 'desc'] | undefined
    onShowDetails: (model: ListItem, schema: Schema) => void
    onOpenSharing: (model: ListItem, schema: Schema) => void
    onDeleteSuccess: (model: ListItem) => void
}) => {
    const [isExpanded, setIsExpanded] = useState(false)

    const queryKeyStr = [
        schema.plural,
        filter ?? '',
        sortOrder ? `${sortOrder[0]}:${sortOrder[1]}` : '',
    ].join('|')

    const { data, hasNextPage, fetchNextPage, isFetching, isError } =
        useInfiniteQuery({
            queryKey: [
                'listOfAll',
                schema.plural,
                filter ?? '',
                sortOrder ? `${sortOrder[0]}:${sortOrder[1]}` : '',
            ],
            staleTime: Infinity,
            queryFn: ({ pageParam = 1, signal }) =>
                engine.query(
                    {
                        result: {
                            resource: schema.plural,
                            params: {
                                fields: 'id,displayName,access,sharing[public],lastUpdated',
                                pageSize: PAGE_SIZE,
                                page: pageParam,
                                ...(filter
                                    ? {
                                          filter: `identifiable:token:${filter}`,
                                      }
                                    : {}),
                                ...(sortOrder
                                    ? {
                                          order: `${sortOrder[0]}:${sortOrder[1]}`,
                                      }
                                    : {}),
                            },
                        },
                    },
                    { signal }
                ) as Promise<SchemaQueryResult>,
            getNextPageParam: (lastPage) => {
                const { pager } = (lastPage as SchemaQueryResult).result
                return pager.page < pager.pageCount ? pager.page + 1 : undefined
            },
        })

    const total = data?.pages[0]
        ? (data.pages[0] as SchemaQueryResult).result.pager.total
        : undefined

    const items =
        data?.pages.flatMap(
            (p) => (p as SchemaQueryResult).result[schema.plural] ?? []
        ) ?? []
    const hasNoItems = items.length === 0

    // reset to close when query params change
    useEffect(() => {
        setIsExpanded(false)
    }, [queryKeyStr])

    // auto-collapse when results come back empty
    useEffect(() => {
        if (total === 0) {
            setIsExpanded(false)
        }
    }, [total])

    return (
        <>
            {/* schema header row — 4 cells to keep column widths stable */}
            <DataTableRow className={css.schemaRow}>
                <DataTableCell width="32px" className={css.expandCell}>
                    <Button
                        className={css.expandButton}
                        secondary
                        small
                        type="button"
                        icon={
                            isExpanded ? (
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M13.5 5.5l-5.5 5.5-5.5-5.5"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        fill="none"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M5.5 2.5l5.5 5.5-5.5 5.5"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        fill="none"
                                    />
                                </svg>
                            )
                        }
                        onClick={() => setIsExpanded((prev) => !prev)}
                    />
                </DataTableCell>
                <DataTableCell colSpan="3" className={css.schemaNameCell}>
                    {schema.displayName}
                    {total !== undefined && (
                        <span className={css.schemaCount}> ({total})</span>
                    )}
                </DataTableCell>
                <DataTableCell />
            </DataTableRow>

            {isExpanded && isError ? <SectionListError /> : null}
            {isExpanded && !isError && isFetching && hasNoItems ? (
                <SectionListLoader />
            ) : null}
            {isExpanded && !isError && !isFetching && hasNoItems ? (
                <SectionListEmpty />
            ) : null}

            {isExpanded &&
                items.map((item, idx) => (
                    <React.Fragment key={item.id}>
                        <DataTableRow>
                            <DataTableCell width="32px" />
                            <DataTableCell>{item.displayName}</DataTableCell>
                            <DataTableCell>
                                {item.lastUpdated ?? ''}
                            </DataTableCell>
                            <DataTableCell>
                                {getPublicAccessLabel(item.sharing?.public)}
                            </DataTableCell>
                            <DataTableCell>
                                <ListOfAllItemActions
                                    model={item}
                                    schema={schema}
                                    onShowDetails={() =>
                                        onShowDetails(item, schema)
                                    }
                                    onOpenSharing={() =>
                                        onOpenSharing(item, schema)
                                    }
                                    onDeleteSuccess={() =>
                                        onDeleteSuccess(item)
                                    }
                                />
                            </DataTableCell>
                        </DataTableRow>
                        {idx === items.length - 1 && isFetching ? (
                            <SectionListLoader />
                        ) : null}
                        {idx === items.length - 1 &&
                        !isFetching &&
                        hasNextPage ? (
                            <DataTableRow>
                                <DataTableCell
                                    colSpan="100"
                                    className={css.loadMoreCell}
                                    onClick={() => fetchNextPage()}
                                    align={'center'}
                                >
                                    {i18n.t('Load more for {{schema}}', {
                                        schema: schema.displayName,
                                    })}
                                </DataTableCell>
                            </DataTableRow>
                        ) : null}
                    </React.Fragment>
                ))}
        </>
    )
}

// ---- main component ----

export const ListOfAll = () => {
    const engine = useDataEngine()
    const schemas = useSchemas()
    const sidebarLinks = useSidebarLinks()
    const [filter, setFilter] = useSectionListFilter('identifiable')

    const [detailsModel, setDetailsModel] = useState<ActiveModel | null>(null)
    const [sharingModel, setSharingModel] = useState<ActiveModel | null>(null)
    const [selectedSchemas, setSelectedSchemas] = useState<string[]>([])
    const [sortOrder, setSortOrder] = useState<
        [string, 'asc' | 'desc'] | undefined
    >(['lastUpdated', 'desc'])

    const allSchemaList = useMemo(
        () =>
            sidebarLinks
                .flatMap(({ links }) => links)
                .filter(({ to }) => !to.startsWith('overview/'))
                .filter(
                    ({ section }) =>
                        (section as { parentSectionKey?: string })
                            .parentSectionKey !== 'organisationUnit'
                )
                .filter(({ section }) => section.name !== 'locale')
                .map(({ section }) => schemas[section.name as SchemaName])
                .filter((s): s is Schema => !!s),
        [sidebarLinks, schemas]
    )

    const schemaList = useMemo(
        () =>
            selectedSchemas.length === 0
                ? allSchemaList
                : allSchemaList.filter((s) =>
                      selectedSchemas.includes(s.singular)
                  ),
        [allSchemaList, selectedSchemas]
    )

    const handleSortChange = ({
        name,
        direction,
    }: {
        name?: string
        direction: DataTableSortDirection
    }) => {
        if (!name || direction === 'default') {
            setSortOrder(undefined)
        } else {
            setSortOrder([name, direction as 'asc' | 'desc'])
        }
    }

    const getSortDirection = (path: string): DataTableSortDirection => {
        if (!sortOrder || sortOrder[0] !== path) {
            return 'default'
        }
        return sortOrder[1]
    }

    return (
        <div>
            <div className={css.filterRow}>
                <IdentifiableFilter />
                <Box width={'500px'} minWidth={'500px'}>
                    <MultiSelect
                        dense
                        filterable
                        filterPlaceholder={i18n.t('Search schema types')}
                        placeholder={i18n.t('All schema types')}
                        selected={selectedSchemas}
                        onChange={({ selected }: { selected: string[] }) =>
                            setSelectedSchemas(selected)
                        }
                    >
                        {allSchemaList.map((s) => (
                            <MultiSelectOption
                                key={s.singular}
                                label={s.displayName}
                                value={s.singular}
                            />
                        ))}
                    </MultiSelect>
                </Box>
                {(!!filter || selectedSchemas.length > 0) && (
                    <Button
                        small
                        onClick={() => {
                            setFilter(undefined)
                            setSelectedSchemas([])
                        }}
                        dataTest="clear-all-filters-button"
                    >
                        {i18n.t('Clear all filters')}
                    </Button>
                )}
            </div>

            <div className={css.listDetailsWrapper}>
                <DataTable className={css.table}>
                    <TableHead>
                        <DataTableRow>
                            <DataTableColumnHeader width="32px" />
                            <DataTableColumnHeader
                                sortDirection={getSortDirection('displayName')}
                                onSortIconClick={handleSortChange}
                                name="displayName"
                            >
                                {i18n.t('Name')}
                            </DataTableColumnHeader>
                            <DataTableColumnHeader
                                sortDirection={getSortDirection('lastUpdated')}
                                onSortIconClick={handleSortChange}
                                name="lastUpdated"
                            >
                                {i18n.t('Last updated')}
                            </DataTableColumnHeader>
                            <DataTableColumnHeader>
                                {i18n.t('Public access')}
                            </DataTableColumnHeader>
                            <DataTableColumnHeader>
                                {i18n.t('Actions')}
                            </DataTableColumnHeader>
                        </DataTableRow>
                    </TableHead>
                    <TableBody>
                        {schemaList.map((schema) => (
                            <SchemaAccordionRows
                                key={schema.singular}
                                schema={schema}
                                engine={engine}
                                filter={filter}
                                sortOrder={sortOrder}
                                onShowDetails={(model, s) =>
                                    setDetailsModel({ model, schema: s })
                                }
                                onOpenSharing={(model, s) =>
                                    setSharingModel({ model, schema: s })
                                }
                                onDeleteSuccess={() => setDetailsModel(null)}
                            />
                        ))}
                    </TableBody>
                </DataTable>

                {detailsModel && (
                    <DetailsPanel
                        onClose={() => setDetailsModel(null)}
                        key={detailsModel.model.id}
                    >
                        <ListOfAllDetailsPanelContent
                            modelId={detailsModel.model.id}
                            schema={detailsModel.schema}
                        />
                    </DetailsPanel>
                )}
            </div>

            {sharingModel && (
                <SharingDialog
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    type={sharingModel.schema.singular as any}
                    id={sharingModel.model.id}
                    onClose={() => setSharingModel(null)}
                />
            )}
        </div>
    )
}
