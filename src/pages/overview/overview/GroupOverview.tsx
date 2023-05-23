import React, { PropsWithChildren } from 'react'
import styles from './GroupOverview.module.css'

type GroupOverviewProps = {
    title: string
}

export const GroupOverview = ({
    children,
    title,
}: PropsWithChildren<GroupOverviewProps>) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>{title}</div>

            {children}
        </div>
    )
}

export const GroupOverviewSummary = ({ children }: PropsWithChildren) => (
    <div className={styles.summary}>{children}</div>
)
