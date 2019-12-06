import propTypes from '@dhis2/prop-types'
import React from 'react'

import { determineClassName } from './helper'

export const Container = ({ children }) => (
    <div className={determineClassName(children)}>{children}</div>
)

Container.propTypes = {
    children: propTypes.oneOfType([
        propTypes.element,
        propTypes.arrayOf(propTypes.element),
    ]).isRequired,
}
