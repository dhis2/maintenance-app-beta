import { RouteObject, Outlet } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import { CircularLoader } from "@dhis2/ui";
import { DefaultLazyLoad } from "../../components";

// React.lazy only works with default exports, so we import directly instead of from index.tsx
const AllOverview = lazy(() => import("./AllOverview"));
const DataElements = lazy(() => import("./DataElements"));

const OverviewWrapper = () => <Outlet />;

const route: RouteObject = {
    path: "/overview",
    element: <DefaultLazyLoad element={<OverviewWrapper />} />,
    children: [
        {   
            index: true,
            element: <AllOverview />
        },
        {
            path: "dataElements",
            element: <DataElements />
        },
    ],
};


export { AllOverview, route };
