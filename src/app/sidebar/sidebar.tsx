import classnames from "classnames";
import React, { useState } from "react";
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
import styles from "./Sidebar.module.css";
import i18n from "@dhis2/d2-i18n";
import { HidePreventUnmount } from "../../components/utils";

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

    const forceOpen = (isFiltered && links.length > 0) || undefined;
    return (
        <SidenavParent
            label={label}
            initialOpen={routePathMatch}
            forceOpen={forceOpen}
        >
            {links.map(({ to, label }) => (
                <SidebarNavLink key={label} to={to} label={label} />
            ))}
        </SidenavParent>
    );
};

interface LinkItem {
    to: string;
    label: string;
}

interface ParentLink {
    label: string;
    links: LinkItem[];
}

type SidebarParentKey =
    | "categories"
    | "dataElements"
    | "dataSets"
    | "indicators"
    | "organisationUnits"
    | "programsAndTracker"
    | "validation";

type SidebarLinks = { [key in SidebarParentKey]: ParentLink };

// Links are in an object instead of children, because Sidebar-component need to do
// the filtering, to know if no matches are found
const sidebarLinks: SidebarLinks = {
    categories: {
        label: i18n.t("Categories"),
        links: [
            {
                label: i18n.t("Overview"),
                to: "overview/categories",
            },
            {
                label: i18n.t("Category Options"),
                to: "categoryOptions",
            },
            {
                label: i18n.t("Category combination"),
                to: "categoryCombination",
            },
            {
                label: i18n.t("Category Option Combination"),
                to: "categoryOptionCombination",
            },
        ],
    },
    dataElements: {
        label: i18n.t("Data elements"),
        links: [
            {
                label: i18n.t("Overview"),
                to: "overview/dataElements",
            },
            {
                label: i18n.t("Data element groups"),
                to: "dataElementGroups",
            },
            {
                label: i18n.t("Data element group set"),
                to: "dataElementGroupSets",
            },
        ],
    },
    dataSets: {
        label: i18n.t("Data sets"),
        links: [
            {
                label: i18n.t("Overview"),
                to: "overview/dataSets",
            },
        ],
    },
    indicators: {
        label: i18n.t("Indicators"),
        links: [
            {
                label: i18n.t("Overview"),
                to: "overview/indicators",
            },
        ],
    },
    organisationUnits: {
        label: i18n.t("Organisation units"),
        links: [
            {
                label: i18n.t("Overview"),
                to: "overview/organisationUnits",
            },
        ],
    },
    programsAndTracker: {
        label: i18n.t("Programs and tracker"),
        links: [
            {
                label: i18n.t("Overview"),
                to: "overview/programs",
            },
        ],
    },
    validation: {
        label: i18n.t("Validation"),
        links: [
            {
                label: i18n.t("Overview"),
                to: "overview/validation",
            },
        ],
    },
};

export const Sidebar = () => {
    const [filterValue, setFilterValue] = useState("");

    const handleFilterChange = (input: OnChangeInput) => {
        setFilterValue(input.value);
    };

    const isFiltered = filterValue !== "";
    const filteredSidebarLinks = isFiltered
        ? Object.entries(sidebarLinks).reduce<SidebarLinks>(
              (acc, [key, { label, links }]) => {
                  const filteredLinkItems = links.filter(({ label }) =>
                      label.toLowerCase().includes(filterValue.toLowerCase())
                  );
                  acc[key] = { label, links: filteredLinkItems };
                  return acc;
              },
              {} as SidebarLinks
          )
        : sidebarLinks;

    const numberOfFilteredLinks = Object.values(filteredSidebarLinks).reduce(
        (acc, curr) => acc + curr.links.length,
        0
    );
    const noMatch = isFiltered && numberOfFilteredLinks === 0;

    return (
        <aside className={css.sidebar}>
            <Sidenav>
                <SidenavFilter onChange={handleFilterChange} />
                <SidenavItems>
                    <SidebarNavLink
                        to="/overview"
                        label={i18n.t("Metadata Overview")}
                        end={true}
                    />
                    {noMatch && <NoMatchMessage filter={filterValue} />}
                    <HidePreventUnmount hide={noMatch}>
                        {Object.values(filteredSidebarLinks).map(
                            ({ label, links }) => (
                                <SidebarParent
                                    key={label}
                                    label={label}
                                    isFiltered={isFiltered}
                                    links={links}
                                />
                            )
                        )}
                    </HidePreventUnmount>
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
