import cx from 'classnames'
import React from 'react'
import { createPortal } from 'react-dom'
import css from './Drawer.module.css' // Import CSS for styling and animation

interface DrawerProps {
    isOpen: boolean
    children: React.ReactNode
    onClose: () => void
}

const DRAWER_PORTAL_ID = 'drawer-portal'

export const Drawer: React.FC<DrawerProps> = ({
    isOpen,
    children,
    onClose,
}) => {
    return (
        <div
            className={cx(css.drawerOverlay, { [css.open]: isOpen })}
            onClick={onClose}
        >
            <div
                className={cx(css.drawer, { [css.open]: isOpen })}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the drawer
            >
                {isOpen && children}
            </div>
        </div>
    )
}

export const DrawerRoot = () => {
    return <div id={DRAWER_PORTAL_ID} className={css.drawerRoot} />
}

export const createPortalToDrawer = (children: React.ReactNode) => {
    const drawerRoot = document.getElementById(DRAWER_PORTAL_ID)

    if (!drawerRoot) {
        console.error(`Drawer portal with ID ${DRAWER_PORTAL_ID} not found.`)
        return null
    }
    return createPortal(children, drawerRoot)
}

export const DrawerPortal = ({ ...drawerProps }: DrawerProps) => {
    return createPortalToDrawer(<Drawer {...drawerProps} />)
}
