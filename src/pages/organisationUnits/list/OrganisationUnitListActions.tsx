import i18n from '@dhis2/d2-i18n'
import {
    Button,
    FlyoutMenu,
    IconEdit16,
    IconMore24,
    MenuItem,
    Popover,
} from '@dhis2/ui'
import React, { useState, useRef } from 'react'
import { useQueryClient } from 'react-query'
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
    // onOpenTranslationClick: (model: BaseListModel) => void
    // onDeleteSuccess: () => void
}

export const OrganisationUnitListActions = ({
    model,
}: // onOpenTranslationClick,
// onDeleteSuccess,
OrganisationUnitListActionProps) => {
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
                // onTranslateClick={() => onOpenTranslationClick(model)}
                onDeleteSuccess={handleDeleteSuccess}
            />
        </ListActions>
    )
}

type OrganisationUnitActionMoreProps = {
    deletable: boolean
    model: BaseListModel
    // onTranslateClick: () => void
    onDeleteSuccess: () => void
}

const OrganisationUnitActionMore = ({
    deletable,
    model,
    // onTranslateClick,
    onDeleteSuccess,
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
                icon={<IconMore24 />}
            />
            {open && (
                <Popover
                    arrow={false}
                    placement="bottom-end"
                    reference={ref}
                    onClickOutside={() => setOpen(false)}
                >
                    <FlyoutMenu>
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

                        {/* <MenuItem
                                dense
                                label={i18n.t('Translate')}
                                icon={<IconTranslate16 />}
                                onClick={() => {
                                    onTranslateClick()
                                    setOpen(false)
                                }}
                            /> */}

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