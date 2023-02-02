import React from 'react'
import { Menu, MenuItem } from '@dhis2/ui'

interface SidenavParentProps {
    title: string,
    children: React.ReactNode
}

export const SidenavFilter = ({ title, children }: SidenavParentProps) => {
    return (
        <Menu>
            <MenuItem label={title} />
        </Menu>
    );
}
