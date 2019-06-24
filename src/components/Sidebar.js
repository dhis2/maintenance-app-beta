import { MenuList, MenuItem } from '@dhis2/ui-core'
import React from 'react'
import propTypes from 'prop-types'

import { FolderClosed } from './icons/FolderClosed'
import { GridSidebar } from './Grid/GridSidebar'
import { ProtectedLink } from './authorization/ProtectedLink'
import { sectionPropType } from './authorization/sectionPropType'

export const Sidebar = ({ sections }) => (
    <GridSidebar>
        <MenuList>
            {sections.map(({ name, path, permissions }) => (
                <ProtectedLink to={path} permissions={permissions}>
                    <MenuItem key={name} icon={<FolderClosed />} label={name} />
                </ProtectedLink>
            ))}
        </MenuList>
    </GridSidebar>
)

Sidebar.propTypes = {
    sections: propTypes.arrayOf(sectionPropType),
}
