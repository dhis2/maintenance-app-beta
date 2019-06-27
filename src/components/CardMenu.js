import { Link } from 'react-router-dom'
import React from 'react'

import { List } from './icons/List'
import { MenuCard, ActionWrapper } from './MenuCard'
import { Plus } from './icons/Plus'
import styles from './CardMenu.module.css'

export const CardMenu = ({ sections }) => (
    <div className={styles.container}>
        <div className={styles.sectionsWrapper}>
            {sections.map(section => (
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
