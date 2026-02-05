import React from 'react'
import styles from './ExpressionBuilder.module.css'

export const PaddedContainer = ({
    children,
    title,
}: {
    children: React.ReactNode
    title?: string
}) => {
    return (
        <div className={styles.paddedContainerContainer}>
            {title && (
                <div className={styles.paddedContainerTitle}>{title}</div>
            )}
            {children}
        </div>
    )
}
