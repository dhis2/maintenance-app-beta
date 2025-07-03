import React from 'react'
import classes from './StandardFormField.module.css'

export function StandardFormField({
    children,
    dataTest,
}: {
    children: React.ReactNode
    dataTest?: string
}) {
    return (
        <div
            className={classes.standardFormField}
            data-test={dataTest ?? 'standard-form-field'}
        >
            {children}
        </div>
    )
}
