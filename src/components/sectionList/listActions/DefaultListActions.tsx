import React from 'react'
import { canEditModel } from '../../../lib/models/access'
import { BaseIdentifiableObject } from '../../../types/generated'
import { ListActions, ActionEdit, ActionMore } from './SectionListActions'

type ModelWithAccess = Pick<BaseIdentifiableObject, 'id' | 'access'>

type DefaultListActionProps = {
    model: ModelWithAccess
    onShowDetailsClick: (model: ModelWithAccess) => void
    onOpenSharingClick: (id: string) => void
}

export const DefaultListActions = ({
    model,
    onShowDetailsClick,
    onOpenSharingClick,
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
            />
        </ListActions>
    )
}
