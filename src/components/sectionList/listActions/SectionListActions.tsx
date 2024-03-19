import i18n from '@dhis2/d2-i18n'
import {
    Button,
    FlyoutMenu,
    IconEdit16,
    IconEdit24,
    IconMore16,
    IconMore24,
    IconShare16,
    MenuItem,
    Popover,
} from '@dhis2/ui'
import React, { useRef, useState } from 'react'
import { useHref, useLinkClickHandler } from 'react-router-dom'
import { TOOLTIPS, BaseListModel } from '../../../lib'
import { LinkButton } from '../../LinkButton'
import { TooltipWrapper } from '../../tooltip'
import { DeleteAction } from './DeleteAction'
import css from './SectionListActions.module.css'

export const ListActions = ({ children }: React.PropsWithChildren) => {
    return <div className={css.listActions}>{children}</div>
}

export const ActionEdit = ({ modelId }: { modelId: string }) => {
    return (
        <LinkButton small secondary to={modelId}>
            <IconEdit24 />
        </LinkButton>
    )
}

type ActionMoreProps = {
    deletable: boolean
    editable: boolean
    model: BaseListModel
    modelType: string
    onShowDetailsClick: () => void
    onOpenSharingClick: () => void
    onDeleteSuccess: () => void
}
export const ActionMore = ({
    deletable,
    editable,
    model,
    modelType,
    onOpenSharingClick,
    onShowDetailsClick,
    onDeleteSuccess,
}: ActionMoreProps) => {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)
    const href = useHref(model.id, { relative: 'path' })

    const handleEditClick = useLinkClickHandler(model.id)

    return (
        <div ref={ref}>
            <Button
                small
                secondary
                onClick={() => setOpen(!open)}
                icon={<IconMore24 />}
            />
            {open && (
                <Popover
                    className={css.actionMorePopover}
                    arrow={false}
                    placement="bottom-end"
                    reference={ref}
                    onClickOutside={() => setOpen(false)}
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
                        <MenuItem
                            dense
                            label={i18n.t('Edit')}
                            icon={<IconEdit16 />}
                            onClick={(_, e) => {
                                handleEditClick(e)
                                setOpen(false)
                            }}
                            target="_blank"
                            href={href}
                        />

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

                        <TooltipWrapper
                            condition={!deletable}
                            content={TOOLTIPS.noDeleteAccess}
                        >
                            <DeleteAction
                                model={model}
                                modelType={modelType}
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
