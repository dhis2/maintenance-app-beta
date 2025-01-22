import i18n from '@dhis2/d2-i18n'
import {
    Button,
    colors,
    FlyoutMenu,
    IconEdit16,
    IconMore16,
    IconMore24,
    IconShare16,
    IconTranslate16,
    MenuItem,
    Popover,
} from '@dhis2/ui'
import React, { useRef, useState } from 'react'
import { useHref, useLinkClickHandler } from 'react-router-dom'
import {
    ActionEdit,
    ListActions,
} from '../../components/sectionList/listActions'
import css from '../../components/sectionList/listActions/SectionListActions.module.css'
import { TooltipWrapper } from '../../components/tooltip'
import {
    BaseListModel,
    TOOLTIPS,
    useLocationSearchState,
    useSchemaFromHandle,
} from '../../lib'
import { canEditModel } from '../../lib/models/access'

type CategoryOptionComboListActionsProps = {
    model: BaseListModel
    onShowDetailsClick: (model: BaseListModel) => void
    onOpenSharingClick: (id: string) => void
    onOpenTranslationClick: (model: BaseListModel) => void
}

export const CategoryOptionComboListActions = ({
    model,
    onShowDetailsClick,
    onOpenSharingClick,
    onOpenTranslationClick,
}: CategoryOptionComboListActionsProps) => {
    const schema = useSchemaFromHandle()
    const [open, setOpen] = useState(false)
    const ref = useRef(null)
    const href = useHref(model.id, { relative: 'path' })
    const preservedSearchState = useLocationSearchState()

    const editable = canEditModel(model)
    const shareable = schema.shareable

    const handleEditClick = useLinkClickHandler(
        {
            pathname: model.id,
        },
        {
            state: preservedSearchState,
        }
    )

    return (
        <ListActions>
            <TooltipWrapper
                condition={!editable}
                content={TOOLTIPS.noEditAccess}
            >
                <ActionEdit disabled={!editable} modelId={model.id} />
            </TooltipWrapper>
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
                                    onShowDetailsClick(model)
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
                        </FlyoutMenu>
                    </Popover>
                )}
            </div>
        </ListActions>
    )
}
