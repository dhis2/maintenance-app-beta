import { Button, ButtonStrip, CircularLoader } from '@dhis2/ui'
import React from 'react'
import classes from './StandardFormActions.module.css'

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
}: {
    cancelLabel: string
    submitLabel: string
    submitting: boolean
    onCancelClick: () => void
}) {
    return (
        <ButtonStrip>
            <Button primary small disabled={submitting} type="submit">
                {submitting && <LoadingIcon />}
                {submitLabel}
            </Button>

            <Button
                secondary
                small
                disabled={submitting}
                onClick={onCancelClick}
            >
                {cancelLabel}
            </Button>
        </ButtonStrip>
    )
}
