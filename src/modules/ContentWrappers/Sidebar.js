import { MenuList } from '@dhis2/ui-core'
import { withRouter } from 'react-router'
import React from 'react'
import propTypes from '@dhis2/prop-types'

import { FolderClosed } from '../icons/FolderClosed'
import { SidebarMenuItem } from './Sidebar/SidebarMenuItem'
import { sectionPropType } from './Sidebar/sectionPropType'
import styles from './Sidebar.module.css'

const SidebarComponent = ({ sections, location, history }) => {
    const filteredSections = sections.filter(
        section => section.hideInSideBar !== true
    )

    return (
        <div className={styles.container}>
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

SidebarComponent.propTypes = {
    sections: propTypes.arrayOf(sectionPropType),
}

const Sidebar = withRouter(SidebarComponent)

export { Sidebar }
