import React from 'react'
import { BaseListModel } from '../../../lib'
import { canEditModel, canDeleteModel } from '../../../lib/models/access'
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
    const deletable = canDeleteModel(model)
    const editable = canEditModel(model)

    return (
        <ListActions>
            <ActionEdit modelId={model.id} />
            <ActionMore
                modelId={model.id}
                deletable={editable}
                editable={deletable}
                onShowDetailsClick={() => onShowDetailsClick(model)}
                onOpenSharingClick={() => onOpenSharingClick(model.id)}
                onDeleteClick={onDeleteClick}
            />
        </ListActions>
    )
}
