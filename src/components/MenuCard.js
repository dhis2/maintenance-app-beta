import { Card } from '@dhis2/ui-core'
import React from 'react'
import propTypes from 'prop-types'

import styles from './MenuCard/styles.module.css'

export const MenuCard = ({ headline, content, children }) => (
    <div className={styles.container}>
        <Card className={styles.card}>
            <h3 className={styles.headline}>
                <span className={styles.headlineInnerWrapper}>{headline}</span>
            </h3>

            <p className={styles.content}>{content}</p>

            <div className={styles.actions}>{children}</div>
        </Card>
    </div>
)

MenuCard.propTypes = {
    headline: propTypes.string.isRequired,
    content: propTypes.string.isRequired,
    children: propTypes.oneOfType([
        propTypes.element,
        propTypes.arrayOf(propTypes.element),
    ]).isRequired,
}

export const ActionWrapper = ({ children }) => (
    <div className={styles.actionWrapper}>{children}</div>
)
