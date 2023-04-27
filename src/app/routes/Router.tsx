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

// This loads all the overview routes in the same chunk since they resolve to the same promise
// see https://reactrouter.com/en/main/route/lazy#multiple-routes-in-a-single-file
// Overviews are small, and the AllOverview would load all the other overviews anyway,
// so it's propbably better to load them all at once
function createOverviewLazyRouteFunction(
    section: string
): LazyRouteFunction<NonIndexRouteObject> {
    return async () => {
        const component = await import(`../../pages/overview/index`);
        return {
            Component: component[section],
        }
    }
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
