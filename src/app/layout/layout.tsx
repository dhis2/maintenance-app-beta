
// create layout component with sidebar and content
import classnames from 'classnames'
import { node, bool } from 'prop-types'
import React from 'react'
import css from './layout.module.css'

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
