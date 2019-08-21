import React from 'react'
import styles from './GridSidebar/styles.module.css'

export const GridSidebar = ({ children }) => (
    <section className={styles.sidebar}>{children}</section>
)
