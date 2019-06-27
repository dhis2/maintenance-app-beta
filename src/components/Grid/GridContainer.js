import React from 'react'
import propTypes from 'prop-types'
import cx from 'classnames'

import styles from './GridContainer.module.css'

export const GridContainer = ({ children, layout }) => (
    <div
        className={cx(
            styles.container,
            layout === 'contentWithSidebar'
                ? styles.contentWithSidebar
                : styles.contentOnly
        )}
    >
        {children}
    </div>
)

GridContainer.propTypes = {
    children: propTypes.oneOfType([
        propTypes.element,
        propTypes.arrayOf(propTypes.element),
    ]).isRequired,
    layout: propTypes.oneOf(['contentOnly', 'contentWithSidebar']),
}

GridContainer.defaultProps = {
    layout: 'contentWithSidebar',
}
