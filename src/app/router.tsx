import { createHashRouter, RouterProvider, Outlet, useRouteError, Navigate } from "react-router-dom";
import { AllOverview } from "../pages";
import { Layout } from "./layout";
import { Sidebar } from "./sidebar";
import React from 'react'

const router = createHashRouter([
    {
        element: (
            <Layout sidebar={<Sidebar />}>
                <Outlet />
            </Layout>
        ),
        //errorElement: <DefaultError />,
        children: [{

            path: "/",
            element: <AllOverview />,
        }, {

            path: "dataElements",
            element: <div>Data Elements</div>,
        }]
    },
]);


export const ConfiguredRouter = () => {
    return <RouterProvider router={router} />;
};
