import cx from 'classnames'
import React from 'react'
import { Outlet, useMatches } from 'react-router-dom'
import { MatchRouteHandle } from '../routes/types'
import { Sidebar } from '../sidebar'
import css from './Layout.module.css'
import { RouteProgress } from './progressbar/RouteProgressBar'

interface BaseLayoutProps {
    children: React.ReactNode
    sidebar?: React.ReactNode
}

export const BaseSidebarLayout = ({ children, sidebar }: BaseLayoutProps) => {
    return (
        <div className={css.wrapper}>
            {sidebar}
            <div className={css.main}>{children}</div>
        </div>
    )
}

export const SidebarLayout = ({
    children,
    hideSidebar,
}: {
    children: React.ReactNode
    hideSidebar?: boolean
}) => {
    return (
        <BaseSidebarLayout
            sidebar={
                <Sidebar
                    className={cx(css.sidebar, { [css.hide]: hideSidebar })}
                />
            }
        >
            {children}
        </BaseSidebarLayout>
    )
}

export const Layout = () => {
    const matches = useMatches() as MatchRouteHandle[]
    // routes can specify a handle to hide the sidebar
    // hide the sidebar if any matched route specifies it
    const hideSidebar = matches.some((match) => match.handle?.hideSidebar)

    return (
        <SidebarLayout hideSidebar={hideSidebar}>
            <RouteProgress />
            <Outlet />
        </SidebarLayout>
    )
}

export default Layout
