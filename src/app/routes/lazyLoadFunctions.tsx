import React from "react";
import { LazyRouteFunction, RouteObject } from "react-router-dom";
import { Section } from "../../constants";
import { LegacyAppRedirect } from "./LegacyAppRedirect";

// This loads all the overview routes in the same chunk since they resolve to the same promise
// see https://reactrouter.com/en/main/route/lazy#multiple-routes-in-a-single-file
// Overviews are small, and the AllOverview would load all the other overviews anyway,
// so it's propbably better to load them all at once
export function createOverviewLazyRouteFunction(
    componentName: string
): LazyRouteFunction<RouteObject> {
    return async () => {
        const routeComponent = await import(`../../pages/overview`);
        return {
            Component: routeComponent[componentName],
        };
    };
}

export function createSectionLazyRouteFunction(
    section: Section,
    componentFileName: string
): LazyRouteFunction<RouteObject> {
    return async () => {
        // means the component is not implemented yet
        // fallback to redirect to legacy
        try {
            return await import(
                `../../pages/${section.namePlural}/${componentFileName}`
            );
        } catch (e) {
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
