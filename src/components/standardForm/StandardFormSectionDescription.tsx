import React from 'react'
import classes from './StandardFormSectionDescription.module.css'

export function StandardFormSectionDescription({
    children,
}: {
    children: React.ReactNode
}) {
    return <p className={classes.standardFormSectionDescription}>{children}</p>
}
