import i18n from "@dhis2/d2-i18n";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation, matchPath } from "react-router-dom";
import { HidePreventUnmount } from "../../components/utils/HidePreventUnmount";
import styles from "./Sidebar.module.css";
import {
    LinkItem,
    ParentLink,
    SidebarLinks,
    sidebarLinks,
} from "./sidebarLinks";
import {
    Sidenav,
    SidenavItems,
    SidenavParent,
    SidenavLink,
    SidenavFilter,
    OnChangeInput,
} from "./sidenav";

interface SidebarNavLinkProps extends LinkItem {
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
    isFiltered: boolean;
    label: string;
    links: LinkItem[];
}

const SidebarParent = ({
    label,
    links = [],
    isFiltered,
}: SidebarParentProps) => {
    const { pathname } = useLocation();
    // Check if any of the children match the current path
    // If they do, parent should be open by default
    const routePathMatch = links.some((link) => {
        return matchPath(link.to, pathname);
    });
    const [isOpen, setIsOpen] = useState(routePathMatch);
    // use separate state for "open" while filtered
    // so parent can be closed while filtered and fall back to previous open
    // state when filter is cleared
    const [openFiltered, setOpenFiltered] = useState(false);

    useEffect(() => {
        if (isFiltered) {
            setOpenFiltered(isFiltered);
        }
    }, [isFiltered]);

    const handleOpen = () => {
        if (isFiltered) {
            setOpenFiltered(!openFiltered);
        } else {
            setIsOpen(!isOpen);
        }
    };

    const open = isFiltered ? openFiltered : isOpen;
    return (
        <SidenavParent label={label} open={open} onClick={handleOpen}>
            {links.map(({ to, label }) => (
                <SidebarNavLink key={label} to={to} label={label} />
            ))}
        </SidenavParent>
    );
};

const matchLabel = (label: string, filterValue: string) =>
    label.toLowerCase().includes(filterValue.toLowerCase());

export const Sidebar = ({ links = sidebarLinks }: { links?: SidebarLinks }) => {
    const [filterValue, setFilterValue] = useState("");

    const handleFilterChange = (input: OnChangeInput) => {
        setFilterValue(input.value);
    };

    const isFiltered = filterValue !== "";
    const filteredSidebarLinks: ParentLink[] = Object.values(links).map(
        ({ label, links }) => ({
            label,
            links: matchLabel(label, filterValue)
                ? links // show all if parent label matches
                : links.filter(({ label }) => matchLabel(label, filterValue)),
        })
    );

    const numberOfFilteredLinks = filteredSidebarLinks.reduce(
        (acc, curr) => acc + curr.links.length,
        0
    );

    const noMatch = isFiltered && numberOfFilteredLinks === 0;

    return (
        <aside className={styles.sidebar}>
            <Sidenav>
                <SidenavFilter onChange={handleFilterChange} />
                <SidenavItems>
                    <SidebarNavLink
                        to="/overview"
                        label={i18n.t("Metadata Overview")}
                        end={true}
                    />
                    {noMatch && <NoMatchMessage filter={filterValue} />}
                    {filteredSidebarLinks.map(({ label, links }) => (
                        <HidePreventUnmount key={label} hide={links.length < 1}>
                            <SidebarParent
                                label={label}
                                isFiltered={isFiltered}
                                links={links}
                            />
                        </HidePreventUnmount>
                    ))}
                </SidenavItems>
            </Sidenav>
        </aside>
    );
};

const NoMatchMessage = ({ filter }) => (
    <div className={styles.noMatchMessage}>
        {i18n.t("No menu items found for")} <br />
        {filter}
    </div>
);

export default Sidebar;
