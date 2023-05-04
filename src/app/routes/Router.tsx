import i18n from "@dhis2/d2-i18n";
import React from "react";
import {
    createHashRouter,
    RouterProvider,
    Outlet,
    Navigate,
    Route,
    createRoutesFromElements,
    LazyRouteFunction,
    RouteObject,
} from "react-router-dom";
import { SECTIONS_MAP, Section } from "../../constants";
import { Layout } from "../layout";
import { Breadcrumb, BreadcrumbItem } from "../layout/Breadcrumb";
import { DefaultErrorRoute } from "./DefaultErrorRoute";
import { LegacyAppRedirect } from "./LegacyAppRedirect";
import { getSectionPath, routePaths } from "./routePaths";
import type { RouteHandle } from "./types";

// This loads all the overview routes in the same chunk since they resolve to the same promise
// see https://reactrouter.com/en/main/route/lazy#multiple-routes-in-a-single-file
// Overviews are small, and the AllOverview would load all the other overviews anyway,
// so it's propbably better to load them all at once
function createOverviewLazyRouteFunction(
    componentName: string
): LazyRouteFunction<RouteObject> {
    return async () => {
        const routeComponent = await import(`../../pages/overview/`);
        return {
            Component: routeComponent[componentName],
        };
    };
}

function createSectionLazyRouteFunction(
    section: Section,
    componentFileName: string
): LazyRouteFunction<RouteObject> {
    return async () => {
        try {
            return await import(
                `../../pages/${section.namePlural}/${componentFileName}`
            );
        } catch (e) {
            // means the component is not implemented yet
            // fallback to redirect to legacy
            if (e.code === "MODULE_NOT_FOUND") {
                return {
                    element: (
                        <LegacyAppRedirect
                            section={section}
                            isNew={componentFileName === "New"}
                        />
                    ),
                };
            }
            throw e;
        }
    };
}

const sectionRoutes = Object.values(SECTIONS_MAP).map((section) => (
    <Route
        key={section.namePlural}
        path={getSectionPath(section)}
        handle={{ section }}
    >
        <Route index lazy={createSectionLazyRouteFunction(section, "List")} />
        <Route
            element={
                <>
                    <Breadcrumb />
                    <Outlet />
                </>
            }
            handle={{
                hideSidebar: true,
            }}
        >
            <Route
                path={routePaths.sectionNew}
                lazy={createSectionLazyRouteFunction(section, "New")}
                handle={{
                    crumb: () => (
                        <BreadcrumbItem
                            label={`${i18n.t("New {{modelName}}", {
                                modelName: section.title,
                            })}`}
                            to={routePaths.sectionNew}
                        />
                    ),
                }}
            />
            <Route
                path=":id"
                lazy={createSectionLazyRouteFunction(section, "Edit")}
                handle={
                    {
                        crumb: (match) => (
                            <BreadcrumbItem
                                label={`${i18n.t("Edit {{modelName}}", {
                                    modelName: section.title,
                                })}`}
                                to={`/${match?.params?.id}`}
                            />
                        ),
                    } as RouteHandle
                }
            />
        </Route>
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

export const hashRouter = createHashRouter(routes);

export const ConfiguredRouter = () => {
    return <RouterProvider router={hashRouter} />;
};
