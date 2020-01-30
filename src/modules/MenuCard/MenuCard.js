import { Link } from 'react-router-dom'

import { Card } from '@dhis2/ui-core'
import React from 'react'
import cx from 'classnames'
import propTypes from '@dhis2/prop-types'

import { createTestNames } from '../../utils/dataTest/createTestNames'
import styles from './MenuCard.module.css'

export const MenuCard = ({ headline, content, children, to }) => (
    <div className={cx(styles.container, createTestNames('menucard'))}>
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
