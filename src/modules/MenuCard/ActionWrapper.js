import React from 'react'
import propTypes from '@dhis2/prop-types'

import styles from './ActionWrapper.module.css'

export const ActionWrapper = ({ children }) => (
    <div className={styles.actionWrapper}>{children}</div>
)

ActionWrapper.propTypes = {
    children: propTypes.oneOfType([
        propTypes.element,
        propTypes.arrayOf(propTypes.element),
    ]).isRequired,
}
