import { MenuList, MenuItem } from '@dhis2/ui-core'
import { withRouter } from 'react-router-dom'
import React from 'react'
import propTypes from 'prop-types'

import { FolderClosed } from './icons/FolderClosed'
import { GridSidebar } from './Grid/GridSidebar'
import { ProtectedLink } from './authorization/ProtectedLink'
import { sectionPropType } from './authorization/sectionPropType'

const Sidebar = ({ sections, location }) => (
    <GridSidebar>
        <MenuList>
            {sections.map(({ name, path, permissions, schemaName }) => (
                <ProtectedLink
                    key={path}
                    to={path}
                    permissions={permissions}
                    schemaName={schemaName}
                >
                    <MenuItem
                        key={name}
                        icon={<FolderClosed />}
                        label={name}
                        active={path === location.pathname}
                    />
                </ProtectedLink>
            ))}
        </MenuList>
    </GridSidebar>
)

Sidebar.propTypes = {
    sections: propTypes.arrayOf(sectionPropType),
}

const SidebarWithRouter = withRouter(Sidebar)

export { SidebarWithRouter as Sidebar }
