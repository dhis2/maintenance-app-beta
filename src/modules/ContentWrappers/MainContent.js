import React from 'react'
import styles from './MainContent.module.css'

export const MainContent = ({ children }) => (
    <div className={styles.content}>{children}</div>
)
