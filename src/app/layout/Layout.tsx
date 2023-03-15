
import React from 'react'
import css from './Layout.module.css'

interface LayoutProps {
    children: React.ReactNode
    sidebar: React.ReactNode
}


export const Layout = ({ children, sidebar }: LayoutProps) => {

    return (
            <div className={css.wrapper}>
            <aside className={css.sidebar}>{sidebar}</aside>
                <div
                    className={css.main}
                >
                    {children}
                </div>
            </div>
    );
}

export default Layout
