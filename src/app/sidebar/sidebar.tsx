import classnames from "classnames";
import React from "react";
import css from "./sidebar.module.css";
import { Sidenav, SidenavItems, SidenavParent, SidenavLink } from "./sidenav/sidenav";
import { NavLink, Link } from "react-router-dom";
interface SidebarProps {
    children?: React.ReactNode;
}

export const Sidebar = ({ children }: SidebarProps) => {
    const ContentList = [
        "Data Elements",
        "Categories",
        "Organisation Units",
        "Data Sets",
        "Programs",
    ].map((item, index) => {
        return <li key={index}>{item}</li>;
    });
    return (
        <aside className={css.sidebar}>
             <Sidenav>
                        <SidenavItems>
                            <SidenavLink><Link to={'/'}>Metadata Overview</Link></SidenavLink>
                            <SidenavParent label="Categories">
                                <SidenavLink>Category Option</SidenavLink>
                                <SidenavLink disabled={true}>Category combination</SidenavLink>
                                <SidenavLink>Category option combination</SidenavLink>
                                <SidenavLink><NavLink to={'/hello'}>Hello</NavLink></SidenavLink>
                            </SidenavParent>
                            <SidenavParent label="Data elements">
                                <SidenavLink label="Data element" />
                                <SidenavLink label="Data element group" />
                                <SidenavLink label="Data element group set" />
                            </SidenavParent>
                            <SidenavParent label="Data sets">
                                <SidenavLink label="Data set" />
                                <SidenavLink label="Data set notifications" />
                            </SidenavParent>
                            <SidenavParent label="Indicators">
                                <SidenavLink label="Indicator" />
                                <SidenavLink label="Indicator type" />
                                <SidenavLink label="Indicator group" />
                                <SidenavLink label="Indicator group set" />
                                <SidenavLink label="Program indicator" />
                                <SidenavLink label="Program indicator group" />
                            </SidenavParent>
                            <SidenavParent label="Organisation units">
                                <SidenavLink label="Organisation unit" />
                                <SidenavLink label="Organisation unit group" />
                                <SidenavLink label="Organisation unit group set" />
                                <SidenavLink label="Organisation unit level" />
                            </SidenavParent>
                            <SidenavParent label="Programs and Tracker">
                                <SidenavLink label="Program" />
                                <SidenavLink label="Tracked entity attribute" />
                                <SidenavLink label="Relationship type" />
                                <SidenavLink label="Tracked entity type" />
                                <SidenavLink label="Program rule" />
                                <SidenavLink label="Program rule variable" />
                            </SidenavParent>
                            <SidenavParent label="Validation">
                                <SidenavLink label="Validation rule" />
                                <SidenavLink label="Validation rule group" />
                                <SidenavLink label="Validation notification" />
                            </SidenavParent>
                            <SidenavLink label="Metadata editor" />
                        </SidenavItems>
                    </Sidenav>
        </aside>
    );
};

export default Sidebar;
