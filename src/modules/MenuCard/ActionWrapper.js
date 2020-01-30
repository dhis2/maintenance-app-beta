import cx from 'classnames'
import React from 'react'
import propTypes from '@dhis2/prop-types'

import { createTestNames } from '../../utils/dataTest/createTestNames'
import styles from './ActionWrapper.module.css'

export const ActionWrapper = ({ children }) => (
    <div
        className={cx(
            styles.actionWrapper,
            createTestNames('menucard-actionwrapper')
        )}
    >
        {children}
    </div>
)

ActionWrapper.propTypes = {
    children: propTypes.oneOfType([
        propTypes.element,
        propTypes.arrayOf(propTypes.element),
    ]).isRequired,
}
