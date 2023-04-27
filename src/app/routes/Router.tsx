import React from "react";
import {
    createHashRouter,
    RouterProvider,
    Outlet,
    Navigate,
    Route,
    createRoutesFromElements,
    LazyRouteFunction,
    NonIndexRouteObject,
} from "react-router-dom";
import { Layout } from "../layout";
import { DefaultErrorRoute } from "./DefaultErrorRoute";

function createOverviewLazyRouteFunction(
    section: string
): LazyRouteFunction<NonIndexRouteObject> {
    return () => import(`../../pages/overview/${section}`);
}

const Routes = createRoutesFromElements(
    <Route element={<Layout />} errorElement={<DefaultErrorRoute />}>
        <Route path="/" element={<Navigate to="/overview" />} />
        <Route path="/overview" element={<Outlet />}>
            <Route
                index={true}
                lazy={createOverviewLazyRouteFunction("AllOverview")}
            />
            <Route
                path="dataElements"
                lazy={createOverviewLazyRouteFunction("DataElements")}
            />
        </Route>
    </Route>
);

export const hashRouter = createHashRouter(Routes);

export const ConfiguredRouter = () => {
    return <RouterProvider router={hashRouter} />;
};
