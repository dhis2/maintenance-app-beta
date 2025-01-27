import cx from 'classnames'
import React from 'react'
import { Outlet, useMatches } from 'react-router-dom'
import { MatchRouteHandle } from '../routes/types'
import { Sidebar } from '../sidebar'
import css from './Layout.module.css'

interface BaseLayoutProps {
    children: React.ReactNode
    sidebar?: React.ReactNode
    showFooter?: boolean
}

export const BaseLayout = ({
    children,
    sidebar,
    showFooter,
}: BaseLayoutProps) => {
    return (
        <div className={showFooter ? css.wrapperWithFooter : css.wrapper}>
            {sidebar}
            <div className={css.main}>{children}</div>
            {showFooter && <div className={css.footerPlaceholder}></div>}
        </div>
    )
}

export const SidebarLayout = ({
    children,
    hideSidebar,
    showFooter,
}: {
    children: React.ReactNode
    hideSidebar?: boolean
    showFooter?: boolean
}) => {
    return (
        <BaseLayout
            showFooter={showFooter}
            sidebar={
                <Sidebar
                    className={cx(css.sidebar, { [css.hide]: hideSidebar })}
                />
            }
        >
            {children}
        </BaseLayout>
    )
}

export const Layout = () => {
    const matches = useMatches() as MatchRouteHandle[]
    // routes can specify a handle to hide the sidebar
    // hide the sidebar if any matched route specifies it
    const hideSidebar = matches.some((match) => match.handle?.hideSidebar)
    const showFooter = matches.some((match) => match.handle?.showFooter)
    return (
        <SidebarLayout hideSidebar={hideSidebar} showFooter={showFooter}>
            <Outlet />
        </SidebarLayout>
    )
}

export default Layout
