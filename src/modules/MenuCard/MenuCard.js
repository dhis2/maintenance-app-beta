import { Link } from 'react-router-dom'
import { Card } from '@dhis2/ui-core'
import React from 'react'
import propTypes from '@dhis2/prop-types'

import styles from './MenuCard.module.css'

export const MenuCard = ({ headline, content, children, to }) => (
    <div className={styles.container}>
        <Card className={styles.card}>
            <Link to={to} className={styles.cardTitleLink}>
                <h3 className={styles.headline}>
                    <span className={styles.headlineInnerWrapper}>
                        {headline}
                    </span>
                </h3>
            </Link>

            <p className={styles.content}>{content}</p>

            <div className={styles.actions}>{children}</div>
        </Card>
    </div>
)

MenuCard.propTypes = {
    children: propTypes.oneOfType([
        propTypes.element,
        propTypes.arrayOf(propTypes.element),
    ]).isRequired,
    content: propTypes.string.isRequired,
    headline: propTypes.string.isRequired,
    to: propTypes.string.isRequired,
}

export const ActionWrapper = ({ children }) => (
    <div className={styles.actionWrapper}>{children}</div>
)

ActionWrapper.propTypes = {
    children: propTypes.oneOfType([
        propTypes.element,
        propTypes.arrayOf(propTypes.element),
    ]).isRequired,
}
