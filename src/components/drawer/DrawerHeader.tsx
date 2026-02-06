import { IconCross24 } from '@dhis2/ui'
import React from 'react'
import css from './Drawer.module.css'

interface DrawerHeaderProps {
    children: React.ReactNode
    onClose: () => void
}

export const DrawerHeader: React.FC<DrawerHeaderProps> = ({
    children,
    onClose,
}) => {
    return (
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
}
