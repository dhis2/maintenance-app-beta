import React from 'react'
import css from './Drawer.module.css'

export const DrawerBodyLayout: React.FC<{
    children: React.ReactNode
    footer: React.ReactNode
}> = ({ children, footer }) => (
    <div className={css.drawerBodyLayout}>
        <div className={css.drawerBodyScrollable}>{children}</div>
        {footer}
    </div>
)
