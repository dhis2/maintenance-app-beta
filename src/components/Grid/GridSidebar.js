import React from 'react'
import styles from './GridSidebar.module.css'

export const GridSidebar = ({ children }) => (
    <section className={styles.sidebar}>{children}</section>
)
