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
import { BaseListModel } from '../../../lib'
import { LinkButton } from '../../LinkButton'
import { WrapWithTooltip } from '../../tooltip'
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

export const ActionOpenSharing = ({
    modelId,
    onOpenSharingClick,
}: {
    modelId: string
    onOpenSharingClick: () => void
}) => {
    return (
        <Button small secondary onClick={onOpenSharingClick}>
            {i18n.t('Open sharing')}
        </Button>
    )
}

type ActionMoreProps = {
    modelId: string
    editAccess: boolean
    onShowDetailsClick: () => void
    onOpenSharingClick: () => void
}
export const ActionMore = ({
    modelId,
    editAccess,
    onOpenSharingClick,
    onShowDetailsClick,
}: ActionMoreProps) => {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)
    const href = useHref(modelId, { relative: 'path' })

    const handleEditClick = useLinkClickHandler(modelId)

    return (
        <div ref={ref}>
            <Button
                small
                secondary
                onClick={() => setOpen(!open)}
                icon={<IconMore24 />}
            ></Button>
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
                        ></MenuItem>
                        <WrapWithTooltip
                            condition={!editAccess}
                            content={WrapWithTooltip.TOOLTIPS.noEditAccess}
                        >
                            <MenuItem
                                dense
                                disabled={!editAccess}
                                label={i18n.t('Sharing settings')}
                                icon={<IconShare16 />}
                                onClick={() => {
                                    onOpenSharingClick()
                                    setOpen(false)
                                }}
                            ></MenuItem>
                        </WrapWithTooltip>
                    </FlyoutMenu>
                </Popover>
            )}
        </div>
    )
}
