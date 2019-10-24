import React from 'react'
import styles from './PageHeadline.module.css'

export const PageHeadline = ({ children }) => (
    <h1 className={styles.headline}>{children}</h1>
)
