import React from 'react'
import propTypes from 'prop-types'
import styles from './SideBar.module.css'

export const SideBar = ({ as: Element, children }) => (
    <Element className={styles.sideBar}>{children}</Element>
)

SideBar.propTypes = {
    as: propTypes.oneOf(['section', 'aside', 'div']),
}

SideBar.defaultProps = {
    as: 'section',
}
