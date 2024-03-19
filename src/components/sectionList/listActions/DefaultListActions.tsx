import React from 'react'
import { BaseListModel } from '../../../lib'
import { canEditModel, canDeleteModel } from '../../../lib/models/access'
import { ListActions, ActionEdit, ActionMore } from './SectionListActions'

type DefaultListActionProps = {
    model: BaseListModel
    modelType: string
    onShowDetailsClick: (model: BaseListModel) => void
    onOpenSharingClick: (id: string) => void
    onDeleteSuccess: () => void
}

export const DefaultListActions = ({
    model,
    modelType,
    onShowDetailsClick,
    onOpenSharingClick,
    onDeleteSuccess,
}: DefaultListActionProps) => {
    const deletable = canDeleteModel(model)
    const editable = canEditModel(model)

    return (
        <ListActions>
            <ActionEdit modelId={model.id} />
            <ActionMore
                deletable={editable}
                editable={deletable}
                model={model}
                modelType={modelType}
                onShowDetailsClick={() => onShowDetailsClick(model)}
                onOpenSharingClick={() => onOpenSharingClick(model.id)}
                onDeleteSuccess={onDeleteSuccess}
            />
        </ListActions>
    )
}
