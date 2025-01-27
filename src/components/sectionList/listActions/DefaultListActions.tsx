import React from 'react'
import { BaseListModel, TOOLTIPS, useSchemaFromHandle } from '../../../lib'
import { canEditModel, canDeleteModel } from '../../../lib/models/access'
import { TooltipWrapper } from '../../tooltip'
import { ListActions, ActionEdit, ActionMore } from './SectionListActions'

export type DefaultListActionProps = {
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
            <TooltipWrapper
                condition={!editable}
                content={TOOLTIPS.noEditAccess}
            >
                <ActionEdit disabled={!editable} modelId={model.id} />
            </TooltipWrapper>
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
