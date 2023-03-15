import { CircularLoader } from "@dhis2/ui";
import React, { Suspense } from "react";
import styles from "./DefaultLazyLoad.module.css";

export const DefaultLazyLoad = ({ element }) => (
    <Suspense fallback={<CircularLoader className={styles.loadingSpinner} />}>
        {element}
    </Suspense>
);
