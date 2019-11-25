import propTypes from '@dhis2/prop-types'
import React from 'react'
import styles from './MainContent.module.css'

export const MainContent = ({ children }) => (
    <div className={styles.content}>{children}</div>
)

MainContent.propTypes = {
    children: propTypes.oneOfType([
        propTypes.element,
        propTypes.arrayOf(propTypes.element),
    ]),
}
