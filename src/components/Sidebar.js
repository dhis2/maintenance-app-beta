import React from 'react'
import propTypes from 'prop-types'

import { GridSidebar } from './Grid/GridSidebar'
import { ProtectedLink } from './authorization/ProtectedLink'
import { sectionPropType } from './authorization/sectionPropType'

export const Sidebar = ({ sections }) => (
    <GridSidebar>
        {sections.map(({ name, path, permissions }) => (
            <div key={name}>
                <ProtectedLink to={path} permissions={permissions}>
                    {name}
                </ProtectedLink>
            </div>
        ))}
    </GridSidebar>
)

Sidebar.propTypes = {
    sections: propTypes.arrayOf(sectionPropType),
}
