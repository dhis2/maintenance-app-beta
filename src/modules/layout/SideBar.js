import React from 'react'
import propTypes from '@dhis2/prop-types'
import styles from './SideBar.module.css'

export const SideBar = ({ as: Element, children }) => (
    <Element className={styles.sideBar}>{children}</Element>
)

SideBar.propTypes = {
    as: propTypes.oneOf(['section', 'aside', 'div']),
    children: propTypes.node,
}

SideBar.defaultProps = {
    as: 'section',
}
