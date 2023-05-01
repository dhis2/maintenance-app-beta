import i18n from "@dhis2/d2-i18n";
import { Card, Button } from "@dhis2/ui";
import { IconEdit24 } from "@dhis2/ui-icons";
import React from "react";
import { Link, resolvePath } from "react-router-dom";
import { routePaths } from "../../../app/routes/routePaths";
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
    title: string;
    to: string;
}

export const SummaryCard = ({
    children,
    icon = DEFAULT_ICON,
    title,
    to,
}: SummaryCardProps) => {
    return (
        <Card>
            <div className={styles.cardWrapper}>
                <div className={styles.cardIcon}>{icon}</div>
                <SummaryCardHeader>{title}</SummaryCardHeader>
                <SummaryCardContent>{children}</SummaryCardContent>
                <SummaryCardActions to={to} />
            </div>
        </Card>
    );
};

export const SummaryCardContent = ({ children }) => {
    return <p className={styles.cardContent}>{children}</p>;
};

interface SummaryCardActionsProps {
    to: string;
}

export const SummaryCardActions = ({ to }: SummaryCardActionsProps) => {
    const path = resolvePath(to).pathname
    return (
        <div className={styles.cardActions}>
            <Link to={path.concat(`/${routePaths.sectionNew}`)}>
                <Button secondary>{i18n.t("Add new")}</Button>
            </Link>
            <Link to={path}>
                <Button secondary>{i18n.t("Manage")}</Button>
            </Link>
        </div>
    );
};
