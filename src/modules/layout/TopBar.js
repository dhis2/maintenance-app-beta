import React from 'react'
import cx from 'classnames'
import propTypes from '@dhis2/prop-types'

import { createTestNames } from '../../utils/dataTest/createTestNames'
import styles from './TopBar.module.css'

export const TopBar = ({ as: Element, children }) => (
    <Element className={cx(styles.topBar, createTestNames('layout-topbar'))}>
        {children}
    </Element>
)

TopBar.propTypes = {
    as: propTypes.oneOf(['header', 'nav', 'section', 'aside', 'div']),
    children: propTypes.node,
}

TopBar.defaultProps = {
    as: 'div',
}
