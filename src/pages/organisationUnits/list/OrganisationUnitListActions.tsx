import i18n from '@dhis2/d2-i18n'
import {
    Button,
    FlyoutMenu,
    IconEdit16,
    IconMore16,
    IconMore24,
    IconTranslate16,
    MenuItem,
    Popover,
} from '@dhis2/ui'
import { useQueryClient } from '@tanstack/react-query'
import React, { useState, useRef } from 'react'
import { useHref, useLinkClickHandler } from 'react-router-dom'
import { DeleteAction } from '../../../components/sectionList/listActions/DeleteAction'
import {
    ListActions,
    ActionEdit,
} from '../../../components/sectionList/listActions/SectionListActions'
import { TooltipWrapper } from '../../../components/tooltip'
import { BaseListModel, TOOLTIPS } from '../../../lib'
import { canDeleteModel } from '../../../lib/models/access'

type OrganisationUnitListActionProps = {
    model: BaseListModel
    onShowDetailsClick: (model: BaseListModel) => void
    onOpenTranslationClick: (model: BaseListModel) => void
}

export const OrganisationUnitListActions = ({
    model,
    onShowDetailsClick,
    onOpenTranslationClick,
}: OrganisationUnitListActionProps) => {
    const deletable = canDeleteModel(model)
    const queryClient = useQueryClient()

    const handleDeleteSuccess = () => {
        queryClient.invalidateQueries({
            queryKey: [{ resource: 'organisationUnits' }],
        })
    }

    return (
        <ListActions>
            <ActionEdit modelId={model.id} />
            <OrganisationUnitActionMore
                deletable={deletable}
                model={model}
                onTranslateClick={() => onOpenTranslationClick(model)}
                onDeleteSuccess={handleDeleteSuccess}
                onShowDetailsClick={onShowDetailsClick}
            />
        </ListActions>
    )
}

type OrganisationUnitActionMoreProps = {
    deletable: boolean
    model: BaseListModel
    onTranslateClick: () => void
    onDeleteSuccess: () => void
    onShowDetailsClick: (model: BaseListModel) => void
}

const OrganisationUnitActionMore = ({
    deletable,
    model,
    onTranslateClick,
    onDeleteSuccess,
    onShowDetailsClick,
}: OrganisationUnitActionMoreProps) => {
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
                dataTest="row-actions-menu-button"
                icon={<IconMore24 />}
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
                            label={i18n.t('Show details')}
                            icon={<IconMore16 />}
                            onClick={() => {
                                onShowDetailsClick(model)
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
                        <MenuItem
                            dense
                            label={i18n.t('Translate')}
                            icon={<IconTranslate16 />}
                            onClick={() => {
                                onTranslateClick()
                                setOpen(false)
                            }}
                        />
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
