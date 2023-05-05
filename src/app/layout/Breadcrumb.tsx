import React from "react";
import { Link, To, useMatches } from "react-router-dom";
import { SECTIONS_MAP } from "../../constants";
import { getSectionPath, getOverviewPath } from "../routes/routePaths";
import { MatchRouteHandle } from "../routes/types";
import css from "./Breadcrumb.module.css";

const Separator = () => <span className={css.separator}>/</span>;

type BreadcrumbItemProps = {
    label?: string;
    to: To;
};

export const BreadcrumbItem = ({ label, to }: BreadcrumbItemProps) => {
    return (
        <Link className={css.breadcrumbItem} to={to}>
            {label}
        </Link>
    );
};

export const Breadcrumb = () => {
    const matches = useMatches() as MatchRouteHandle[];
    const section = matches.find((match) => !!match.handle?.section)?.handle
        ?.section;

    if (!section) {
        return null;
    }

    const sectionCrumb = (
        <BreadcrumbItem
            to={`/${getSectionPath(section)}`}
            label={section.title}
        />
    );
    let overviewCrumb: JSX.Element | undefined;

    if (section.parentSectionKey) {
        const parentSection = SECTIONS_MAP[section.parentSectionKey];
        overviewCrumb = (
            <BreadcrumbItem
                to={`/${getOverviewPath(parentSection)}`}
                label={parentSection.titlePlural}
            />
        );
    }

    return (
        <div className={css.breadcrumbWrapper}>
            {overviewCrumb}
            <Separator />
            {sectionCrumb}
        </div>
    );
};
