import React from 'react'
import classes from './StandardFormSubsectionTitle.module.css'

export function StandardFormSubsectionTitle({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return <h3 className={classes.standardFormSubsectionTitle}>{children}</h3>
}
