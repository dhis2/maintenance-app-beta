import propTypes from '@dhis2/prop-types'
import React from 'react'
import cx from 'classnames'

import { childrenContainsSideBar, childrenContainsTopBar } from './helper'
import styles from './Container.module.css'

const determineClassName = children => {
    const withSidebar = childrenContainsSideBar(children)
    const withTopBar = childrenContainsTopBar(children)

    return cx(styles.container, {
        [styles.withSidebar]: withSidebar,
        [styles.withTopBar]: withTopBar,
    })
}

export const Container = ({ children }) => (
    <div className={determineClassName(children)}>{children}</div>
)

Container.propTypes = {
    children: propTypes.oneOfType([
        propTypes.element,
        propTypes.arrayOf(propTypes.element),
    ]).isRequired,
}
