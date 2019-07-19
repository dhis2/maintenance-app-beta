import React from 'react'
import styles from './Content.module.css'

export const Content = ({ children }) => (
    <div className={styles.content}>{children}</div>
)
