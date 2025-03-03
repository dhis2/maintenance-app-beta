import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React from 'react'
import { TooltipWrapper } from '../../components/tooltip'
import { canEditModel, TOOLTIPS } from '../../lib'
import { OrgUnitListModel } from './ListRows'
import classes from './OrganisationUnitLevels.module.css'

export const EditingListActions = ({
    model,
    onSaveClick,
    onCancelClick,
}: {
    model: OrgUnitListModel
    onSaveClick: () => void
    onCancelClick: () => void
}) => {
    const editable = canEditModel(model)
    return (
        <div className={classes.editingActions} data-test="row-actions">
            <TooltipWrapper
                condition={!editable}
                content={TOOLTIPS.noEditAccess}
            >
                <Button
                    small
                    disabled={!editable}
                    secondary
                    aria-label={i18n.t('Save')}
                    onClick={onSaveClick}
                    className={classes.editingActions}
                >
                    {i18n.t('Save')}
                </Button>
            </TooltipWrapper>

            <Button
                small
                secondary
                aria-label={i18n.t('Cancel')}
                onClick={onCancelClick}
                className={classes.editingActions}
            >
                {i18n.t('Cancel')}
            </Button>
        </div>
    )
}
