import i18n from '@dhis2/d2-i18n'
import { Button, colors, IconEdit24, IconTranslate24 } from '@dhis2/ui'
import React from 'react'
import { ListActions } from '../../components/sectionList/listActions'
import { TooltipWrapper } from '../../components/tooltip'
import { canEditModel, Schema, TOOLTIPS } from '../../lib'
import { OrgUnitListModel } from './ListRows'

export const ViewingListActions = ({
    model,
    schema,
    onTranslationClick,
    onEditClick,
}: {
    model: OrgUnitListModel
    schema: Schema
    onTranslationClick: () => void
    onEditClick: () => void
}) => {
    const editable = canEditModel(model)
    return (
        <ListActions>
            <TooltipWrapper
                condition={!editable}
                content={TOOLTIPS.noEditAccess}
            >
                <Button
                    small
                    disabled={!editable}
                    secondary
                    aria-label={i18n.t('Edit')}
                    onClick={onEditClick}
                >
                    <IconEdit24 color={colors.grey600} />
                </Button>
            </TooltipWrapper>
            <TooltipWrapper
                condition={!schema.translatable}
                content={TOOLTIPS.noEditAccess}
            >
                <Button
                    small
                    disabled={!schema.translatable}
                    secondary
                    aria-label={i18n.t('Translate')}
                    onClick={onTranslationClick}
                >
                    <IconTranslate24 color={colors.grey600} />
                </Button>
            </TooltipWrapper>
        </ListActions>
    )
}
