import React from 'react'
import cx from 'classnames'
import propTypes from '@dhis2/prop-types'

import { createTestNames } from '../../utils/dataTest/createTestNames'
import styles from './MainContent.module.css'

export const MainContent = ({ children }) => (
    <div className={cx(styles.content, createTestNames('maincontent'))}>
        {children}
    </div>
)

MainContent.propTypes = {
    children: propTypes.oneOfType([
        propTypes.element,
        propTypes.arrayOf(propTypes.element),
    ]),
}
