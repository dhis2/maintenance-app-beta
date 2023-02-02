import { RouteObject } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import { CircularLoader } from "@dhis2/ui";
import { DefaultLazyLoad } from "../../components";

// React.lazy only works with default exports, so we import directly instead of from index.tsx
const AllOverview = lazy(() => import("./all-overview"));

const route: RouteObject = {
    path: "/",
    element: <DefaultLazyLoad element={<AllOverview />} />,
};

export { AllOverview, route };
