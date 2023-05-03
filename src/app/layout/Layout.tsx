import React from "react";
import { Outlet, useMatches } from "react-router-dom";
import { MatchRouteHandle } from "../routes/types";
import { Sidebar } from "../sidebar";
import css from "./Layout.module.css";

interface BaseLayoutProps {
    children: React.ReactNode;
    sidebar?: React.ReactNode;
}

export const BaseLayout = ({ children, sidebar }: BaseLayoutProps) => {
    return (
        <div className={css.wrapper}>
            {sidebar && <aside className={css.sidebar}>{sidebar}</aside>}
            <div className={css.main}>{children}</div>
        </div>
    );
};

export const BaseLayoutWithSidebar = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return <BaseLayout sidebar={<Sidebar />}>{children}</BaseLayout>;
};

export const Layout = () => {
    const matches = useMatches();

    // routes can specify a handle to hide the sidebar
    const showSidebar = matches.some((match) => {
        const sidebarHandleMatch = match as MatchRouteHandle;
        return sidebarHandleMatch.handle?.hideSidebar;
    });

    const LayoutComponent = showSidebar ? BaseLayout : BaseLayoutWithSidebar;
    return (
        <LayoutComponent>
            <Outlet />
        </LayoutComponent>
    );
};

export default Layout;
