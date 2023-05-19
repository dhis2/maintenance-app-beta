import i18n from "@dhis2/d2-i18n";
import { Card, Button } from "@dhis2/ui";
import { IconEdit24 } from "@dhis2/ui-icons";
import React from "react";
import { Link } from "react-router-dom";
import {
    getSectionNewPath,
    getSectionPath,
} from "../../../app/routes/routePaths";
import { SECTIONS_MAP, Section } from "../../../constants";
import styles from "./SummaryCard.module.css";

const DEFAULT_ICON = <IconEdit24 />;

const SummaryCardHeader = ({ children }: { children: React.ReactNode }) => (
    <div className={styles.cardHeader}>{children}</div>
);

export const SummaryCardGroup = ({
    children,
    title,
}: {
    children: React.ReactNode;
    title?: string;
}) => {
    return (
        <>
            {title && <div className={styles.cardGroupHeader}>{title}</div>}
            <div className={styles.cardGroup}>{children}</div>
        </>
    );
};

interface SummaryCardProps {
    children: React.ReactNode;
    icon?: React.ReactNode;
    section: Section;
}

export const SummaryCard = ({
    icon = DEFAULT_ICON,
    children,
    section,
}: SummaryCardProps) => {
    const title = section.title;
    return (
        <Card>
            <Link to={`/${getSectionPath(section)}`}>
                <div className={styles.cardWrapper}>
                    <div className={styles.cardIcon}>{icon}</div>
                    <SummaryCardHeader>{title}</SummaryCardHeader>
                    <SummaryCardContent>{children}</SummaryCardContent>
                    <SummaryCardActions section={section} />
                </div>
            </Link>
        </Card>
    );
};

export const SummaryCardContent = ({ children }) => {
    return <p className={styles.cardContent}>{children}</p>;
};

interface SummaryCardActionsProps {
    section: Section;
}

export const SummaryCardActions = ({ section }: SummaryCardActionsProps) => {
    // categoryOptionCombo is the only section that should not be creatable
    // TODO: implement auth and move this there
    const canCreate = section.name !== SECTIONS_MAP.categoryOptionCombo.name;
    return (
        <div className={styles.cardActions}>
            {canCreate && (
                <Link to={`/${getSectionNewPath}`} tabIndex={-1}>
                    <Button secondary>{i18n.t("Add new")}</Button>
                </Link>
            )}
            <Link to={`/${getSectionPath(section)}`} tabIndex={-1}>
                <Button secondary>{i18n.t("Manage")}</Button>
            </Link>
        </div>
    );
};
