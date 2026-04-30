import i18n from '@dhis2/d2-i18n'
import {
    Button,
    FlyoutMenu,
    IconEdit16,
    IconInfo16,
    IconLaunch16,
    IconSync16,
    IconShare16,
    IconTranslate16,
    IconView16,
    MenuItem,
    Popover,
} from '@dhis2/ui'
import { useQueryClient } from '@tanstack/react-query'
import React, { createContext, useContext, useRef, useState } from 'react'
import { useHref, useLinkClickHandler } from 'react-router-dom'
import { DrawerHeader, DrawerPortal, DrawerRoot } from '../../components/drawer'
import { DefaultListActionProps } from '../../components/sectionList/listActions/DefaultListActions'
import { DeleteAction } from '../../components/sectionList/listActions/DeleteAction'
import {
    ActionShowDetails,
    ListActions,
} from '../../components/sectionList/listActions/SectionListActions'
import { TooltipWrapper } from '../../components/tooltip'
import {
    BaseListModel,
    TOOLTIPS,
    useLocationSearchState,
    useSchemaFromHandle,
} from '../../lib'
import { canDeleteModel, canEditModel } from '../../lib/models/access'
import { SqlView } from '../../types/generated'
import { useRunSqlView } from './api/useSqlViewActions'
import { SqlViewResults } from './Results'

type SqlViewListModel = BaseListModel & {
    type?: SqlView.type
}

const SqlViewResultsDrawerContext = createContext<(id: string) => void>(
    () => {}
)

export const SqlViewResultsDrawerProvider = ({
    children,
}: React.PropsWithChildren) => {
    const [selectedSqlViewId, setSelectedSqlViewId] = useState<string>()

    return (
        <>
            <DrawerRoot />
            <DrawerPortal
                isOpen={!!selectedSqlViewId}
                onClose={() => setSelectedSqlViewId(undefined)}
                header={
                    <DrawerHeader
                        onClose={() => setSelectedSqlViewId(undefined)}
                    >
                        {i18n.t('SQL view results')}
                    </DrawerHeader>
                }
                disableFocusTrap
            >
                {selectedSqlViewId && <SqlViewResults id={selectedSqlViewId} />}
            </DrawerPortal>
            <SqlViewResultsDrawerContext.Provider value={setSelectedSqlViewId}>
                {children}
            </SqlViewResultsDrawerContext.Provider>
        </>
    )
}

export const getRunActionLabel = (type: SqlView.type | undefined) => {
    switch (type) {
        case SqlView.type.QUERY:
            return i18n.t('Run query')
        case SqlView.type.MATERIALIZED_VIEW:
        case SqlView.type.VIEW:
        default:
            return i18n.t('Create or update view')
    }
}

export const SqlViewListActions = ({
    model,
    onShowDetailsClick,
    onOpenSharingClick,
    onOpenTranslationClick,
    onDeleteSuccess,
}: DefaultListActionProps) => {
    const sqlViewModel = model as SqlViewListModel
    const schema = useSchemaFromHandle()
    const deletable = canDeleteModel(model)
    const editable = canEditModel(model)
    const shareable = schema.shareable

    const [open, setOpen] = useState(false)
    const ref = useRef(null)
    const href = useHref(model.id, { relative: 'path' })
    const preservedSearchState = useLocationSearchState()
    const queryClient = useQueryClient()
    const { run, running } = useRunSqlView()
    const openResultsDrawer = useContext(SqlViewResultsDrawerContext)

    const handleEditClick = useLinkClickHandler(
        { pathname: model.id },
        { state: preservedSearchState }
    )

    const runActionLabel = getRunActionLabel(sqlViewModel.type)
    const isQuery = sqlViewModel.type === SqlView.type.QUERY

    const handleRun = async () => {
        if (isQuery) {
            openResultsDrawer(model.id)
            setOpen(false)
            return
        }
        if (!sqlViewModel.type) {
            return
        }
        const result = await run(model.id, sqlViewModel.type)
        if (result.success) {
            queryClient.invalidateQueries({
                queryKey: [{ resource: `sqlViews/${model.id}/data` }],
            })
        }
        setOpen(false)
    }

    return (
        <ListActions>
            <ActionShowDetails onClick={() => onShowDetailsClick(model)} />
            <div ref={ref}>
                <Button
                    small
                    secondary
                    onClick={() => setOpen(!open)}
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
                            <MenuItem
                                dense
                                label={i18n.t('View results')}
                                icon={<IconView16 />}
                                onClick={() => {
                                    openResultsDrawer(model.id)
                                    setOpen(false)
                                }}
                                dataTest="row-actions-view-results"
                            />
                            <MenuItem
                                dense
                                disabled={running || !editable}
                                label={runActionLabel}
                                icon={
                                    sqlViewModel.type ===
                                    SqlView.type.MATERIALIZED_VIEW ? (
                                        <IconSync16 />
                                    ) : (
                                        <IconLaunch16 />
                                    )
                                }
                                onClick={() => {
                                    handleRun()
                                }}
                                dataTest={`row-actions-run-${
                                    sqlViewModel.type ?? 'view'
                                }`}
                            />
                            <TooltipWrapper
                                condition={!editable}
                                content={TOOLTIPS.noEditAccess}
                            >
                                <MenuItem
                                    dense
                                    disabled={!editable}
                                    label={i18n.t('Edit')}
                                    icon={<IconEdit16 />}
                                    onClick={(_, e) => {
                                        handleEditClick(e)
                                        setOpen(false)
                                    }}
                                    target="_blank"
                                    href={href}
                                />
                            </TooltipWrapper>
                            <MenuItem
                                dense
                                label={i18n.t('Show details')}
                                icon={<IconInfo16 />}
                                onClick={() => {
                                    onShowDetailsClick(model)
                                    setOpen(false)
                                }}
                            />
                            {shareable && (
                                <TooltipWrapper
                                    condition={!editable}
                                    content={TOOLTIPS.noEditAccess}
                                >
                                    <MenuItem
                                        dense
                                        disabled={!editable}
                                        label={i18n.t('Sharing settings')}
                                        icon={<IconShare16 />}
                                        onClick={() => {
                                            onOpenSharingClick(model.id)
                                            setOpen(false)
                                        }}
                                    />
                                </TooltipWrapper>
                            )}
                            {schema.translatable && (
                                <MenuItem
                                    dense
                                    label={i18n.t('Translate')}
                                    icon={<IconTranslate16 />}
                                    onClick={() => {
                                        onOpenTranslationClick(model)
                                        setOpen(false)
                                    }}
                                />
                            )}
                            <TooltipWrapper
                                condition={!deletable}
                                content={TOOLTIPS.noDeleteAccess}
                            >
                                <DeleteAction
                                    modelId={model.id}
                                    modelDisplayName={model.displayName}
                                    disabled={!deletable}
                                    onDeleteSuccess={() => {
                                        onDeleteSuccess(model)
                                        setOpen(false)
                                    }}
                                    onCancel={() => setOpen(false)}
                                />
                            </TooltipWrapper>
                        </FlyoutMenu>
                    </Popover>
                )}
            </div>
        </ListActions>
    )
}
