import { IconWarningFilled16 } from '@dhis2/ui'
import React from 'react'
import css from './InlineWarning.module.css'

type InlineWarningProps = {
    message: string
}

export const InlineWarning = ({ message }: InlineWarningProps) => {
    return (
        <span className={css.warning}>
            <IconWarningFilled16 />
            <span>{message}</span>
        </span>
    )
}
