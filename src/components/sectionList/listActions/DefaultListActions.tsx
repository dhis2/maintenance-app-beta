import React from 'react'
import { BaseListModel, useSchemaFromHandle } from '../../../lib'
import { canEditModel, canDeleteModel } from '../../../lib/models/access'
import { ListActions, ActionEdit, ActionMore } from './SectionListActions'

type DefaultListActionProps = {
    model: BaseListModel
    onShowDetailsClick: (model: BaseListModel) => void
    onOpenSharingClick: (id: string) => void
    onOpenTranslationClick: (model: BaseListModel) => void
    onDeleteSuccess: () => void
}

export const DefaultListActions = ({
    model,
    onShowDetailsClick,
    onOpenSharingClick,
    onOpenTranslationClick,
    onDeleteSuccess,
}: DefaultListActionProps) => {
    const schema = useSchemaFromHandle()

    const deletable = canDeleteModel(model)
    const editable = canEditModel(model)
    const shareable = schema.shareable

    return (
        <ListActions>
            <ActionEdit modelId={model.id} />
            <ActionMore
                deletable={deletable}
                editable={editable}
                translatable={schema.translatable}
                shareable={shareable}
                model={model}
                onShowDetailsClick={() => onShowDetailsClick(model)}
                onOpenSharingClick={() => onOpenSharingClick(model.id)}
                onTranslateClick={() => onOpenTranslationClick(model)}
                onDeleteSuccess={onDeleteSuccess}
            />
        </ListActions>
    )
}
