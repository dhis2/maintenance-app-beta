import { CircularLoader } from "@dhis2/ui";
import React from "react";
import {
    createHashRouter,
    RouterProvider,
    Outlet,
    Navigate,
    Route,
    createRoutesFromElements,
    RouteObject,
} from "react-router-dom";
import { LoadingSpinner } from "../../components/loading/LoadingSpinner";
import { SECTIONS_MAP } from "../../constants";
import { Layout, SidebarLayout } from "../layout";
import { DefaultErrorRoute } from "./DefaultErrorRoute";
import {
    createOverviewLazyRouteFunction,
    createSectionLazyRouteFunction,
} from "./lazyLoadFunctions";
import { ResetRouterContext } from "./ResetRouterContext";
import { getSectionPath, routePaths } from "./routePaths";
const sectionRoutes = Object.values(SECTIONS_MAP).map((section) => (
    <Route
        key={section.namePlural}
        path={getSectionPath(section)}
        handle={{ section }}
    >
        <Route index lazy={createSectionLazyRouteFunction(section, "List")} />
        <Route
            path={routePaths.sectionNew}
            lazy={createSectionLazyRouteFunction(section, "New")}
            handle={{
                hideSidebar: true,
            }}
        />
        <Route
            path=":id"
            lazy={createSectionLazyRouteFunction(section, "Edit")}
        />
    </Route>
));

const routes = createRoutesFromElements(
    <Route element={<Layout />} errorElement={<DefaultErrorRoute />}>
        <Route
            path="/"
            element={<Navigate to={routePaths.overviewRoot} replace />}
        />
        <Route path={routePaths.overviewRoot} element={<Outlet />}>
            <Route
                index
                lazy={createOverviewLazyRouteFunction("AllOverview")}
            />
            <Route
                path={getSectionPath(SECTIONS_MAP.dataElement)}
                lazy={createOverviewLazyRouteFunction("DataElements")}
            />
            <Route
                path={getSectionPath(SECTIONS_MAP.category)}
                lazy={createOverviewLazyRouteFunction("Categories")}
            />
        </Route>
        {sectionRoutes}
    </Route>
);

const createRouter = (routes: RouteObject[]) => createHashRouter(routes);
const hashRouter = createRouter(routes);

export const ConfiguredRouter = () => {
    const [router, setRouter] = React.useState(hashRouter);

    // this can be used to reset the router
    // eg when an error occurs, it can be used to retry loading a chunk
    // note that this umounts and remounts the entire router-tree
    const reset = React.useCallback(() => {
        setRouter(createRouter(routes));
    }, []);

    return (
        <ResetRouterContext.Provider value={{ reset }}>
            <RouterProvider
                router={router}
                fallbackElement={
                    <SidebarLayout>
                        <LoadingSpinner />
                    </SidebarLayout>
                }
            />
        </ResetRouterContext.Provider>
    );
};
