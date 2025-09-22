import React from 'react'
import styles from './ExpressionField.module.css'

export const PaddedContainer = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return <div className={styles.container}>{children}</div>
}
