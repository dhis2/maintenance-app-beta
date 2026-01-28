import React from 'react'
import styles from './ExpressionBuilder.module.css'

export const PaddedContainer = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return <div className={styles.paddedContainerContainer}>{children}</div>
}
