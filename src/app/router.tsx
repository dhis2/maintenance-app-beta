import {
    createHashRouter,
    RouterProvider,
    Outlet,
    useRouteError,
    Navigate,
} from "react-router-dom";
import { Layout } from "./layout";
import { Sidebar } from "./sidebar";
import React, { Suspense, lazy } from "react";
import { CircularLoader } from "@dhis2/ui";
import { routes } from '../pages/'

const DefaultLazyLoad = ({ element }) => (
    <Suspense fallback={<CircularLoader />}>{element}</Suspense>
);

// React.lazy only works with default exports, so we import directly instead of from index.tsx
const AllOverview = lazy(() => import("../pages/overview/all-overview"));
//const DataElements = lazy(() => import("../pages/data-elements/data-elements"));

const router = createHashRouter([
    {
        // no path means its a layout route
        element: (
            <Layout sidebar={<Sidebar />}>
                <Outlet />
            </Layout>
        ),

        // TODO: Should we list all routes here, or import children-routes from pages?
        // children: [
        //     {
        //         path: "/",
        //         element: <DefaultLazyLoad element={<AllOverview />} />,
        //     },
        //     {
        //         path: 'dataElements',
        //         element: <div>Data Elements</div>,
        //     },
        // ],
        children: routes,
    },
]);

export const ConfiguredRouter = () => {
    return <RouterProvider router={router} />;
};
