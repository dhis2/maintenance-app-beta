import cx from 'classnames'
import React from 'react'
import css from './Drawer.module.css' // Import CSS for styling and animation

interface DrawerProps {
    isOpen: boolean
    children: React.ReactNode
    onClose: () => void
}

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
