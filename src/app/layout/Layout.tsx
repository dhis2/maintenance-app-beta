import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../sidebar";
import css from "./Layout.module.css";

interface BaseLayoutProps {
    children: React.ReactNode;
    sidebar: React.ReactNode;
}

export const BaseLayout = ({ children, sidebar }: BaseLayoutProps) => {
    return (
        <div className={css.wrapper}>
            <aside className={css.sidebar}>{sidebar}</aside>
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

export const Layout = () => (
    <BaseLayoutWithSidebar>
        <Outlet />
    </BaseLayoutWithSidebar>
);

export default Layout;
