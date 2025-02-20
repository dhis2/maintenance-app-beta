import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React from 'react'
import css from './ErrorRetry.module.css'

const getErrorMessageFromError = (error: unknown): string => {
    if (typeof error === 'string') {
        return error
    }
    if (error instanceof Error) {
        return error.message
    }
    return String(error)
}

export const ErrorRetry = ({
    error,
    onRetryClick,
}: {
    error: unknown
    onRetryClick?: () => void
}) => {
    const errorMessage = getErrorMessageFromError(error)
    return (
        <div className={css.error}>
            <span className={css.errorMessage}>{errorMessage}</span>
            {onRetryClick && (
                <Button type="button" secondary small onClick={onRetryClick}>
                    {i18n.t('Retry')}
                </Button>
            )}
        </div>
    )
}
