import React from 'react'
import propTypes from 'prop-types'
import styles from './Content.module.css'

export const Content = ({ as: Element, children }) => (
    <Element className={styles.content}>{children}</Element>
)

Content.propTypes = {
    as: propTypes.oneOf(['main', 'div']),
}

Content.defaultProps = {
    as: 'main',
}
