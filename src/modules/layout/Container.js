import React from 'react'
import cx from 'classnames'
import propTypes from '@dhis2/prop-types'

import { createTestNames } from '../../utils/dataTest/createTestNames'
import { determineClassName } from './helper'

export const Container = ({ children, dataTest }) => (
    <div
        className={cx(
            createTestNames('layout-container'),
            determineClassName(children),
            dataTest
        )}
    >
        {children}
    </div>
)

Container.propTypes = {
    children: propTypes.oneOfType([
        propTypes.element,
        propTypes.arrayOf(propTypes.element),
    ]).isRequired,
    dataTest: propTypes.string,
}
