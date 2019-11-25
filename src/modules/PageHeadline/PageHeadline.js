import propTypes from '@dhis2/prop-types'
import React from 'react'
import styles from './PageHeadline.module.css'

export const PageHeadline = ({ children }) => (
    <h1 className={styles.headline}>{children}</h1>
)

PageHeadline.propTypes = {
    children: propTypes.node.isRequired,
}
