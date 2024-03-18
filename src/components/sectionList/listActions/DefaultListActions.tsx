import React from 'react'
import { BaseListModel } from '../../../lib'
import { canEditModel } from '../../../lib/models/access'
import { ListActions, ActionEdit, ActionMore } from './SectionListActions'

type DefaultListActionProps = {
    model: BaseListModel
    onShowDetailsClick: (model: BaseListModel) => void
    onOpenSharingClick: (id: string) => void
    onDeleteClick: () => void
}

export const DefaultListActions = ({
    model,
    onShowDetailsClick,
    onOpenSharingClick,
    onDeleteClick,
}: DefaultListActionProps) => {
    const editAccess = canEditModel(model)
    return (
        <ListActions>
            <ActionEdit modelId={model.id} />
            <ActionMore
                modelId={model.id}
                editAccess={editAccess}
                onShowDetailsClick={() => onShowDetailsClick(model)}
                onOpenSharingClick={() => onOpenSharingClick(model.id)}
                onDeleteClick={onDeleteClick}
            />
        </ListActions>
    )
}
