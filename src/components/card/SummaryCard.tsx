import React from "react";
import { Card, Button } from "@dhis2/ui";
import { IconEdit24 } from "@dhis2/ui-icons";
import styles from "./SummaryCard.module.css";
import { Link } from "react-router-dom";
import i18n from "@dhis2/d2-i18n";

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
    return (
        <div className={styles.cardActions}>
            <Link to={to.concat("/new")}>
                <Button secondary>{i18n.t("Add new")}</Button>
            </Link>
            <Link to={to}>
                <Button secondary>{i18n.t("Manage")}</Button>
            </Link>
        </div>
    );
};
