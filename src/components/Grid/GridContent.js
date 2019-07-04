import React from 'react'
import propTypes from 'prop-types'

import styles from './GridContent.module.css'

export const GridContent = ({ children }) => (
    <section className={styles.content}>{children}</section>
)

GridContent.propTypes = {
    children: propTypes.oneOfType([
        propTypes.element,
        propTypes.arrayOf(propTypes.element),
    ]).isRequired,
}
