import React from 'react'
import cx from 'classnames'
import propTypes from '@dhis2/prop-types'

import { createTestNames } from '../../utils/dataTest/createTestNames'
import styles from './Content.module.css'

export const Content = ({ as: Element, children }) => (
    <Element className={cx(styles.content, createTestNames('layout-content'))}>
        {children}
    </Element>
)

Content.propTypes = {
    as: propTypes.oneOf(['main', 'div']),
    children: propTypes.node,
}

Content.defaultProps = {
    as: 'main',
}
