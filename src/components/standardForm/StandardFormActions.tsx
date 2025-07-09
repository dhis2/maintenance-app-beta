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
    submitting,
    onSubmitClick,
    cancelTo,
    onCancelClick,
}: {
    cancelLabel?: string
    submitLabel: string
    submitting: boolean
    onSubmitClick: () => void
    cancelTo?: To
    onCancelClick?: () => void
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
            <LinkButton
                secondary
                small
                disabled={submitting}
                to={cancelTo}
                onClick={onCancelClick}
                dataTest="form-cancel-link"
            >
                {cancelLabel ?? i18n.t('Cancel')}
            </LinkButton>
        </ButtonStrip>
    )
}
