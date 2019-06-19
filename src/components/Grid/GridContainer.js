import React from 'react';
import propTypes from 'prop-types';

import styles from './GridContainer.module.css'

export const GridContainer = ({ children }) => (
    <div className={styles.container}>
        {children}
    </div>
)

GridContainer.propTypes = {
    children: propTypes.oneOfType([
        propTypes.element,
        propTypes.arrayOf(propTypes.element),
    ]).isRequired,
}
