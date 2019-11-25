import React from 'react'
import propTypes from '@dhis2/prop-types'
import styles from './TopBar.module.css'

export const TopBar = ({ as: Element, children }) => (
    <Element className={styles.topBar}>{children}</Element>
)

TopBar.propTypes = {
    as: propTypes.oneOf(['header', 'nav', 'section', 'aside', 'div']),
    children: propTypes.node,
}

TopBar.defaultProps = {
    as: 'div',
}
