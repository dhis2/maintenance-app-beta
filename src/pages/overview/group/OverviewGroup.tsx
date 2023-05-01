import React from "react";
import styles from "./OverviewGroup.module.css";

export const OverviewGroup = ({ children, title }) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>{title}</div>
            {children}
        </div>
    );
};

export const OverViewGroupSummary = ({ children }) => (
    <div className={styles.summary}>{children}</div>
);
