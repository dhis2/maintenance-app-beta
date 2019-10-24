import { Link } from 'react-router-dom'
import React from 'react'

import { List } from '../icons/List'
import { MenuCard, ActionWrapper } from '../MenuCard/MenuCard'
import { Plus } from '../icons/Plus'
import styles from './styles.module.css'

export const CardMenu = ({ sections }) => {
    const filteredSections = sections.filter(
        section => section.hideInCardMenu !== true
    )

    return (
        <div className={styles.container}>
            <div className={styles.sectionsWrapper}>
                {filteredSections.map(section => (
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
