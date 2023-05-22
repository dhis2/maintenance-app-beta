import { CircularLoader } from "@dhis2/ui";
import cx from "classnames";
import React from "react";
import styles from "./Loader.module.css";

export const LoadingSpinner = ({ centered = true }: { centered?: boolean }) => (
    <CircularLoader
        className={cx(styles.loadingSpinner, { [styles.centered]: centered })}
    />
);
