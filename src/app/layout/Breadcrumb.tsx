import React from "react";
import {
    Link,
    To,
    useMatches,
} from "react-router-dom";
import { SECTIONS_MAP, Section } from "../../constants";
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

export const BreadcrumbSectionItem = ({
    label,
    section,
}: {
    label?: string;
    section: Section;
}) => (
    <Link className={css.breadcrumbItem} to={`/${getSectionPath(section)}`}>
        {label ?? section.titlePlural}
    </Link>
);

export const Breadcrumb = () => {
    const matches = useMatches() as MatchRouteHandle[];
    const section = matches.find((match) => !!match.handle?.section)?.handle
        ?.section;

    if (!section) {
        return null;
    }

    const extraCrumbs = matches
        .filter((match) => match.handle?.crumb)
        .map((match) => {
            console.log(match);
            return match.handle?.crumb?.(match) as JSX.Element;
        });
    const CrumbElements: JSX.Element[] = [];

    if (section.parentSectionKey) {
        const parentSection = SECTIONS_MAP[section.parentSectionKey];
        CrumbElements.push(
            <BreadcrumbItem
                to={`/${getOverviewPath(parentSection)}`}
                label={parentSection.title}
            />
        );
    }
    CrumbElements.push(<BreadcrumbSectionItem section={section} />);

    const finalCrumb = CrumbElements.concat(...extraCrumbs);
    return (
        <div className={css.breadcrumbWrapper}>
            {finalCrumb.map((crumb, i) => (
                <span key={i}>
                    {crumb}
                    <Separator />
                </span>
            ))}
        </div>
    );
};
