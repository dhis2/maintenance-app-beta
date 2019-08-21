import { Link } from 'react-router-dom'
import React from 'react'

import { List } from './icons/List'
import { MenuCard, ActionWrapper } from './MenuCard'
import { Plus } from './icons/Plus'
import styles from './CardMenu/styles.module.css'

export const CardMenu = ({ sections }) => {
    const filteredSections = sections.filter(item => {
        if (!Array.isArray(item)) return true

        const [section, config = {}] = item
        return config.hideInCardMenu !== true
    })

    const formattedSections = filteredSections.map(item =>
        !Array.isArray(item) ? item : item[0]
    )

    return (
        <div className={styles.container}>
            <div className={styles.sectionsWrapper}>
                {formattedSections.map(section => (
                    <MenuCard
                        key={section.name}
                        headline={section.name}
                        content={section.description || ''}
                    >
                        <ActionWrapper>
                            <Link
                                to={`${section.path.replace(
                                    /^\/list/,
                                    '/edit'
                                )}/add`}
                            >
                                <Plus />
                            </Link>
                        </ActionWrapper>

                        <ActionWrapper>
                            <Link to={section.path}>
                                <List />
                            </Link>
                        </ActionWrapper>
                    </MenuCard>
                ))}
            </div>
        </div>
    )
}
