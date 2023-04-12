import React from "react";
import styles from "./GroupOverview.module.css";

export const GroupOverview = ({ children, title }) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>{title}</div>

            {children}
        </div>
    );
};

export const GroupOverviewSummary = ({ children }) => (
    <div className={styles.summary}>{children}</div>
);
