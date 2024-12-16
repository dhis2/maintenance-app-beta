import i18n from '@dhis2/d2-i18n'
import {
    Button,
    FlyoutMenu,
    IconEdit16,
    IconEdit24,
    IconMore16,
    IconMore24,
    IconShare16,
    IconTranslate16,
    MenuItem,
    Popover,
    colors,
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
        >
            <IconEdit24 color={colors.grey600} />
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
                icon={<IconMore24 color={colors.grey600} />}
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
                                model={model}
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
