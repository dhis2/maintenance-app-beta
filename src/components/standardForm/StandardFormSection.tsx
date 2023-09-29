import React from 'react'
import classes from './StandardFormSection.module.css'

export function StandardFormSection({
    children,
}: {
    children: React.ReactNode
}) {
    return <section className={classes.standardFormSection}>{children}</section>
}
