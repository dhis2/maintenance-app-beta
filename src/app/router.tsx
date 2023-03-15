import { NoticeBox } from "@dhis2/ui";
import React from "react";
import {
    createHashRouter,
    RouterProvider,
    Outlet,
    useRouteError,
    Navigate,
    isRouteErrorResponse,
} from "react-router-dom";
import { routes } from "../pages";
import { Layout } from "./layout";
import { Sidebar } from "./sidebar"

const LayoutElement = () => (
    <Layout sidebar={<Sidebar />}>
        <Outlet />
    </Layout>
);

const DefaultErrorRoute = () => {
    const error = useRouteError();
    const isRouteError = isRouteErrorResponse(error);

    let title = "An error occurred";
    let message = error?.message ?? "An unknown error occurred.";
    if (isRouteError) {
        title = error.statusText
        message = error?.error?.message
    }
    return (
        <Layout sidebar={<Sidebar />}>
            <NoticeBox
                warning={isRouteError}
                error={!isRouteError}
                title={title}
            >{message}</NoticeBox>
        </Layout>
    );
};
const router = createHashRouter([
    {
        // no path means its a layout route
        element: <LayoutElement />,
        errorElement: <DefaultErrorRoute />,
        // TODO: Should we list all routes here, or import children-routes from pages?
        // PROS: All routes are in one place
        // children: [
        //     {
        //         path: "/",
        //         element: <DefaultLazyLoad element={<AllOverview />} />,
        //     },
        //     {
        //         path: 'dataElements/',
        //         element: <div>Data Elements</div>,
        //     },
        //     {

        // ],
        children: routes,
    },
    {
        path: "/",
        element: <Navigate to="/overview" />,
    },
]);

export const ConfiguredRouter = () => {
    return <RouterProvider router={router} />;
};
