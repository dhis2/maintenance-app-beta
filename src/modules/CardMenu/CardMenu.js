import { Link } from 'react-router-dom'
import React from 'react'
import propTypes from '@dhis2/prop-types'
import cx from 'classnames'

import { ActionWrapper } from '../MenuCard/ActionWrapper'
import { List } from '../icons/List'
import { MenuCard } from '../MenuCard/MenuCard'
import { Plus } from '../icons/Plus'
import { createTestNames } from '../../utils/dataTest/createTestNames'
import { sectionPropType } from '../ContentWrappers/Sidebar/sectionPropType'
import styles from './CardMenu.module.css'

export const CardMenu = ({ sections }) => {
    const filteredSections = sections.filter(
        section => section.hideInCardMenu !== true
    )

    return (
        <div className={cx(styles.container, createTestNames('cardmenu'))}>
            <div className={styles.sectionsWrapper}>
                {filteredSections.map(section => {
                    const pageType = section.path.replace(/^\/list/, '/edit')
                    const addPath = `${pageType}/add`
                    const listPath = section.path

                    return (
                        <MenuCard
                            key={section.name}
                            headline={section.name}
                            content={section.description || ''}
                            to={listPath}
                        >
                            <ActionWrapper>
                                <Link to={addPath}>
                                    <Plus />
                                </Link>
                            </ActionWrapper>

                            <ActionWrapper>
                                <Link to={listPath}>
                                    <List />
                                </Link>
                            </ActionWrapper>
                        </MenuCard>
                    )
                })}
            </div>
        </div>
    )
}

CardMenu.propTypes = {
    sections: propTypes.arrayOf(sectionPropType).isRequired,
}
