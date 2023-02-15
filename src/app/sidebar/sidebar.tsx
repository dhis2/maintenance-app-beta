import classnames from "classnames";
import React, { useState, useEffect } from "react";
import css from "./Sidebar.module.css";
import {
    Sidenav,
    SidenavItems,
    SidenavParent,
    SidenavLink,
    SidenavFilter,
    OnChangeCallback,
    OnChangeInput,
} from "./sidenav";
import { NavLink, useLocation, matchPath } from "react-router-dom";
import i18n from "@dhis2/d2-i18n";

interface SidebarProps {
    children?: React.ReactNode;
}

interface SidebarNavLinkProps {
    to: string;
    label: string;
    disabled?: boolean;
    end?: boolean;
}
const SidebarNavLink = ({ to, label, disabled, end }: SidebarNavLinkProps) => {
    return (
        <SidenavLink
            to={to}
            disabled={disabled}
            LinkComponent={NavLink}
            label={label}
            end={end}
        />
    );
};

interface SidebarParentProps {
    filter: string;
    label: string;
    children: React.ReactElement<SidebarNavLinkProps>[];
}

const SidebarParent = ({ filter, label, children }: SidebarParentProps) => {
    const { pathname } = useLocation();

    // Check if any of the children match the current path
    // If they do, parent should be open by default
    const routePathMatch = children.some((child) => {
        return matchPath(child.props.to, pathname);
    });

    const isFiltered = filter !== "";
    const filteredChildren = isFiltered
        ? children.filter(({ props: { label } }) => {
              return label.toLowerCase().includes(filter.toLowerCase());
          })
        : children;

    const forceOpen = (isFiltered && filteredChildren.length > 0) || undefined;
    const noMatch = isFiltered && filteredChildren.length === 0;

    if (noMatch) {
        return null;
    }

    return (
        <SidenavParent
            label={label}
            initialOpen={routePathMatch}
            forceOpen={forceOpen}
        >
            {filteredChildren}
        </SidenavParent>
    );
};


export const Sidebar = ({ children }: SidebarProps) => {
    const [filterValue, setFilterValue] = useState("");

    const handleFilterChange = (input: OnChangeInput) => {
        setFilterValue(input.value);
    };

    return (
        <aside className={css.sidebar}>
            <Sidenav>
                <SidenavItems>
                    <SidenavFilter onChange={handleFilterChange} />
                    <SidebarNavLink
                        to="/overview"
                        label={i18n.t("Metadata Overview")}
                        end={true}
                    />
                    <SidebarParent
                        label={i18n.t("Categories")}
                        filter={filterValue}
                    >
                        <SidebarNavLink
                            label={i18n.t("Overview")}
                            to="overview/categories"
                        />
                        <SidebarNavLink
                            label={"Category Option"}
                            to={"categoryOptions"}
                        />
                        <SidebarNavLink
                            label={"Category Combination"}
                            to={"categoryCombinations"}
                        />
                        <SidebarNavLink
                            label={i18n.t("Category option combination")}
                            to={"categoryOptionCombinations"}
                        />
                    </SidebarParent>
                    <SidebarParent label="Data elements" filter={filterValue}>
                        <SidebarNavLink
                            label={i18n.t("Overview")}
                            to="/overview/dataElements"
                        />
                        <SidebarNavLink
                            label={i18n.t("Data Elements")}
                            to="dataElements"
                        />
                    </SidebarParent>
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
