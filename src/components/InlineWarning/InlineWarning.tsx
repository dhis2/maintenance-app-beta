import { IconWarningFilled16 } from '@dhis2/ui'
import React from 'react'
import css from './InlineWarning.module.css'

type InlineWarningProps = {
    message: string
    className?: string
    iconColor?: string
}

export const InlineWarning = React.memo(function InlineWarning({
    message,
    className,
    iconColor = '#6f3205',
}: InlineWarningProps) {
    return (
        <span className={`${css.warningBadge} ${className || ''}`}>
            <IconWarningFilled16 color={iconColor} />
            <span className={css.warningText}>{message}</span>
        </span>
    )
})
