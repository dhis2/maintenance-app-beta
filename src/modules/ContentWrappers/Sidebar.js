import { useHistory, useLocation } from 'react-router-dom'

import { MenuList } from '@dhis2/ui-core'
import React from 'react'
import propTypes from '@dhis2/prop-types'
import cx from 'classnames'

import { FolderClosed } from '../icons/FolderClosed'
import { SidebarMenuItem } from './Sidebar/SidebarMenuItem'
import { createTestNames } from '../../utils/dataTest/createTestNames'
import { sectionPropType } from './Sidebar/sectionPropType'
import styles from './Sidebar.module.css'

export const Sidebar = ({ sections }) => {
    const history = useHistory()
    const location = useLocation()

    const filteredSections = sections.filter(
        section => section.hideInSideBar !== true
    )

    return (
        <div className={cx(styles.container, createTestNames('sidebar'))}>
            <MenuList>
                {filteredSections.map(
                    ({ name, path, permissions, schemaName }) => (
                        <SidebarMenuItem
                            key={name}
                            permissions={permissions}
                            schemaName={schemaName}
                            icon={<FolderClosed />}
                            label={name}
                            active={path === location.pathname}
                            onClick={() => history.push(path)}
                        />
                    )
                )}
            </MenuList>
        </div>
    )
}

Sidebar.propTypes = {
    sections: propTypes.arrayOf(sectionPropType),
}
