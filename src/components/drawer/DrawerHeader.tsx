import { IconCross24 } from '@dhis2/ui-icons'
import React from 'react'
import css from './Drawer.module.css'

export interface DrawerHeaderProps {
    children: React.ReactNode | string
    onClose: () => void
}

export const DrawerHeader: React.FC<DrawerHeaderProps> = ({
    children,
    onClose,
}) => (
    <div className={css.drawerHeader}>
        <div className={css.drawerHeaderContent}>{children}</div>
        <button
            className={css.drawerCloseButton}
            onClick={onClose}
            aria-label="Close drawer"
            type="button"
        >
            <IconCross24 />
        </button>
    </div>
)
