import cx from 'classnames'
import React from 'react'
import { createPortal } from 'react-dom'
import { Outlet, useMatches } from 'react-router-dom'
import { MatchRouteHandle } from '../routes/types'
import { Sidebar } from '../sidebar'
import css from './Layout.module.css'

interface BaseLayoutProps {
    children: React.ReactNode
    sidebar?: React.ReactNode
}

export const FOOTER_ID = 'main-layout-footer'
export const BaseLayout = ({ children, sidebar }: BaseLayoutProps) => {
    return (
        <div className={css.wrapper}>
            {sidebar}
            <div className={css.main}>{children}</div>
            <div id={FOOTER_ID} className={css.footer}></div>
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

/* The footer is often used as part of a form - for formActions like Save and Cancel
    Layout wise it's easier to have the footer as part of the main layout 
       - scroll position of "main" content is correct by default (rather than scroll behind the footer)
    thus we use react portal to render the footer contents within the footer div.
*/
export const createPortalToFooter = (children: React.ReactNode) =>
    createPortal(children, document.getElementById(FOOTER_ID) as HTMLElement)

export default Layout
