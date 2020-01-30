import React from 'react'
import cx from 'classnames'
import propTypes from '@dhis2/prop-types'

import { createTestNames } from '../../utils/dataTest/createTestNames'
import styles from './SideBar.module.css'

export const SideBar = ({ as: Element, children }) => (
    <Element className={cx(styles.sideBar, createTestNames('layout-sidebar'))}>
        {children}
    </Element>
)

SideBar.propTypes = {
    as: propTypes.oneOf(['section', 'aside', 'div']),
    children: propTypes.node,
}

SideBar.defaultProps = {
    as: 'section',
}
