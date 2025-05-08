import { Button, ButtonStrip, CircularLoader } from '@dhis2/ui'
import React from 'react'
import classes from './StandardFormActions.module.css'
import { To } from 'react-router-dom'
import { LinkButton } from '../LinkButton'

function LoadingIcon() {
    return (
        <span className={classes.submitButtonLoadingIcon}>
            <CircularLoader small />
        </span>
    )
}

export function StandardFormActions({
    cancelLabel,
    submitLabel,
    submitting,
    onCancelClick,
    onSubmitClick,
    cancelTo,
}: {
    cancelLabel: string
    submitLabel: string
    submitting: boolean
    onCancelClick?: () => void
    onSubmitClick: () => void
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
            >
                {submitting && <LoadingIcon />}
                {submitLabel}
            </Button>
            <LinkButton
                secondary
                small
                disabled={submitting}
                to={cancelTo}
                // onClick={onCancelClick}
            >
                {cancelLabel}
            </LinkButton>
        </ButtonStrip>
    )
}
