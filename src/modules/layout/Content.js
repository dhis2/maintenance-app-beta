import React from 'react'
import propTypes from '@dhis2/prop-types'
import styles from './Content.module.css'

export const Content = ({ as: Element, children }) => (
    <Element className={styles.content}>{children}</Element>
)

Content.propTypes = {
    as: propTypes.oneOf(['main', 'div']),
    children: propTypes.node,
}

Content.defaultProps = {
    as: 'main',
}
