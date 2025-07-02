import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip, CircularLoader } from '@dhis2/ui'
import React from 'react'
import { To } from 'react-router-dom'
import { LinkButton } from '../LinkButton'
import classes from './StandardFormActions.module.css'

function LoadingIcon() {
    return (
        <span
            className={classes.submitButtonLoadingIcon}
            data-test="loading-icon"
        >
            <CircularLoader small />
        </span>
    )
}

export function StandardFormActions({
    cancelLabel,
    submitLabel,
    saveLabel = i18n.t('Save'),
    submitting,
    onSubmitClick,
    onSaveClick,
    cancelTo,
}: {
    cancelLabel: string
    submitLabel: string
    saveLabel?: string
    submitting: boolean
    onSubmitClick: () => void
    onSaveClick?: () => void
    cancelTo?: To
}) {
    return (
        <ButtonStrip>
            <Button
                primary
                small
                disabled={submitting}
                type="submit"
                onClick={onSubmitClick}
                dataTest="form-submit-button"
            >
                {submitting && <LoadingIcon />}
                {submitLabel}
            </Button>
            {onSaveClick && (
                <Button
                    primary
                    small
                    disabled={submitting}
                    type="button"
                    onClick={onSaveClick}
                >
                    {submitting && <LoadingIcon />}
                    {saveLabel}
                </Button>
            )}
            <LinkButton
                secondary
                small
                disabled={submitting}
                to={cancelTo}
                dataTest="form-cancel-link"
            >
                {cancelLabel}
            </LinkButton>
        </ButtonStrip>
    )
}
