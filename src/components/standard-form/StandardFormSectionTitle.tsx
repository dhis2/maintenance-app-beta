import React from 'react'
import classes from './StandardFormSectionTitle.module.css'

export function StandardFormSectionTitle({ children }: { children: React.ReactNode }) {
    return <h2 className={classes.standardFormSectionTitle}>{children}</h2>
}
