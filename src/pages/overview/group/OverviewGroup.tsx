import React, { PropsWithChildren, ReactNode } from 'react'
import styles from './OverviewGroup.module.css'

type OverviewGroupProps = {
    title: string
}

export const OverviewGroup = ({
    children,
    title,
}: PropsWithChildren<OverviewGroupProps>) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>{title}</div>
            {children}
        </div>
    )
}

export const OverviewGroupSummary = ({ children }: { children: ReactNode }) => (
    <div className={styles.summary}>{children}</div>
)
