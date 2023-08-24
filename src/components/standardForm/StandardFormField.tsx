import React from 'react'
import classes from './StandardFormField.module.css'

export function StandardFormField({ children }: { children: React.ReactNode }) {
    return <div className={classes.standardFormField}>{children}</div>
}
