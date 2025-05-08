import { Button, ButtonStrip, CircularLoader } from '@dhis2/ui'
import React from 'react'
import { To } from 'react-router-dom'
import { LinkButton } from '../LinkButton'
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
    onSubmitClick,
    cancelTo,
}: {
    cancelLabel: string
    submitLabel: string
    submitting: boolean
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
            <LinkButton secondary small disabled={submitting} to={cancelTo}>
                {cancelLabel}
            </LinkButton>
        </ButtonStrip>
    )
}
