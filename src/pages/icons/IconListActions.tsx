import i18n from '@dhis2/d2-i18n'
import {
    Button,
    colors,
    FlyoutMenu,
    IconInfo16,
    IconMore24,
    MenuItem,
    Popover,
} from '@dhis2/ui'
import React, { useRef, useState } from 'react'
import { ListActions } from '../../components/sectionList/listActions'
import { DeleteAction } from '../../components/sectionList/listActions/DeleteAction'
import css from '../../components/sectionList/listActions/SectionListActions.module.css'
import { TooltipWrapper } from '../../components/tooltip'
import { TOOLTIPS } from '../../lib'
import { IconModel } from './List'

type IconListActionsProps = {
    model: IconModel
    onShowDetailsClick: (model: IconModel) => void
    onDeleteSuccess: (model: IconModel) => void
}

export const IconListActions = ({
    model,
    onShowDetailsClick,
    onDeleteSuccess,
}: IconListActionsProps) => {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    const deletable = model.custom

    return (
        <ListActions>
            <div ref={ref}>
                <Button
                    small
                    secondary
                    onClick={() => setOpen(!open)}
                    dataTest="row-actions-menu-button"
                    icon={<IconMore24 color={colors.grey600} />}
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
                                icon={<IconInfo16 />}
                                onClick={() => {
                                    onShowDetailsClick(model)
                                    setOpen(false)
                                }}
                            />
                            <TooltipWrapper
                                condition={!deletable}
                                content={TOOLTIPS.noDeleteAccess}
                            >
                                <DeleteAction
                                    modelId={model.key}
                                    modelDisplayName={model.key}
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
