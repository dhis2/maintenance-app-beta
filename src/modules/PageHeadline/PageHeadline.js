import cx from 'classnames'
import React from 'react'
import propTypes from '@dhis2/prop-types'

import { createTestNames } from '../../utils/dataTest/createTestNames'
import styles from './PageHeadline.module.css'

export const PageHeadline = ({ children }) => (
    <h1 className={cx(styles.headline, createTestNames('pageheadline'))}>
        {children}
    </h1>
)

PageHeadline.propTypes = {
    children: propTypes.node.isRequired,
}
