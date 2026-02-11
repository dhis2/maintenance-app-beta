import i18n from '@dhis2/d2-i18n'
import {
    Button,
    FlyoutMenu,
    IconEdit16,
    IconMore16,
    IconShare16,
    IconTranslate16,
    MenuItem,
    Popover,
} from '@dhis2/ui'
import React, { useRef, useState } from 'react'
import { useHref, useLinkClickHandler } from 'react-router-dom'
import { TOOLTIPS, BaseListModel, useLocationSearchState } from '../../../lib'
import { LinkButton } from '../../LinkButton'
import { TooltipWrapper } from '../../tooltip'
import { DeleteAction } from './DeleteAction'
import css from './SectionListActions.module.css'

export const ListActions = ({ children }: React.PropsWithChildren) => {
    return (
        <div className={css.listActions} data-test="row-actions">
            {children}
        </div>
    )
}

export const ActionEdit = ({
    modelId,
    disabled,
}: {
    modelId: string
    disabled?: boolean
}) => {
    const preservedSearchState = useLocationSearchState()
    return (
        <LinkButton
            small
            disabled={disabled}
            secondary
            to={{ pathname: modelId }}
            state={preservedSearchState}
            dataTest="row-edit-action-button"
        >
            {/* TODO: replace with IconEdit16 when LinkButton has been updated */}
            <svg
                width="22"
                height="24"
                viewBox="0 0 22 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M13.6129 6.62389L13.7071 6.70708L16.2929 9.29286C16.6534 9.65335 16.6811 10.2206 16.3761 10.6129L16.2929 10.7071L9 18H5V14L12.2929 6.70708C12.6534 6.34659 13.2206 6.31886 13.6129 6.62389ZM13 7.41418L6.207 14.2062L8.792 16.7912L15.5858 9.99997L13 7.41418Z"
                    fill="#6C7787"
                />
            </svg>
        </LinkButton>
    )
}

type ActionMoreProps = {
    deletable: boolean
    editable: boolean
    translatable: boolean
    shareable: boolean
    model: BaseListModel
    onShowDetailsClick: () => void
    onOpenSharingClick: () => void
    onTranslateClick: () => void
    onDeleteSuccess: () => void
}
export const ActionMore = ({
    deletable,
    editable,
    translatable,
    shareable,
    model,
    onOpenSharingClick,
    onShowDetailsClick,
    onTranslateClick,
    onDeleteSuccess,
}: ActionMoreProps) => {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)
    const href = useHref(model.id, { relative: 'path' })
    const preservedSearchState = useLocationSearchState()

    const handleEditClick = useLinkClickHandler(
        {
            pathname: model.id,
        },
        {
            state: preservedSearchState,
        }
    )

    return (
        <div ref={ref}>
            <Button
                small
                secondary
                onClick={() => setOpen(!open)}
                dataTest="row-actions-menu-button"
                icon={
                    // TODO: replace with IconMore16 when Button has been updated
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
                    className={css.actionMorePopover}
                    arrow={false}
                    placement="bottom-end"
                    reference={ref}
                    onClickOutside={() => setOpen(false)}
                    dataTest="row-actions-menu"
                >
                    <FlyoutMenu>
                        <MenuItem
                            dense
                            label={i18n.t('Show details')}
                            icon={<IconMore16 />}
                            onClick={() => {
                                onShowDetailsClick()
                                setOpen(false)
                            }}
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
                                        onOpenSharingClick()
                                        setOpen(false)
                                    }}
                                />
                            </TooltipWrapper>
                        )}
                        {translatable && (
                            <MenuItem
                                dense
                                label={i18n.t('Translate')}
                                icon={<IconTranslate16 />}
                                onClick={() => {
                                    onTranslateClick()
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
                                    onDeleteSuccess()
                                    setOpen(false)
                                }}
                                onCancel={() => setOpen(false)}
                            />
                        </TooltipWrapper>
                    </FlyoutMenu>
                </Popover>
            )}
        </div>
    )
}
