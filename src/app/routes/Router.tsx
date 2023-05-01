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
import { SECTIONS_MAP } from "../../constants";
import { Layout } from "../layout";
import { DefaultErrorRoute } from "./DefaultErrorRoute";
import { getSectionPath, routePaths } from "./routePaths";

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

const routes = createRoutesFromElements(
    <Route element={<Layout />} errorElement={<DefaultErrorRoute />}>
        <Route path="/" element={<Navigate to={routePaths.overviewRoot} />} />
        <Route path={routePaths.overviewRoot} element={<Outlet />}>
            <Route
                index
                lazy={createOverviewLazyRouteFunction("AllOverview")}
            />
            <Route
                path={getSectionPath(SECTIONS_MAP.dataElement)}
                lazy={createOverviewLazyRouteFunction("DataElements")}
            />
        </Route>
    </Route>
);

export const hashRouter = createHashRouter(routes);

export const ConfiguredRouter = () => {
    return <RouterProvider router={hashRouter} />;
};
