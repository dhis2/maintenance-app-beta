import React from 'react'
import {
    createHashRouter,
    RouterProvider,
    Outlet,
    Navigate,
    Route,
    createRoutesFromElements,
    LazyRouteFunction,
    IndexRouteObject,
    NonIndexRouteObject,
    useParams,
} from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'
import {
    SECTIONS_MAP,
    SCHEMA_SECTIONS,
    Section,
    SchemaSection,
    OVERVIEW_SECTIONS,
    getSectionPath,
    isModuleNotFoundError,
    isValidUid,
    routePaths,
} from '../../lib'
import { OverviewSection } from '../../types'
import { Layout, Breadcrumbs, BreadcrumbItem } from '../layout'
import { CheckAuthorityForSection } from './CheckAuthorityForSection'
import { DefaultErrorRoute } from './DefaultErrorRoute'
import { LegacyAppRedirect } from './LegacyAppRedirect'

// This loads all the overview routes in the same chunk since they resolve to the same promise
// see https://reactrouter.com/en/main/route/lazy#multiple-routes-in-a-single-file
// Overviews are small, and the AllOverview would load all the other overviews anyway,
// so it's propbably better to load them all at once

// function foo<T extends boolean>(returnString: T): T extends true ? string : number;
// function foo<T extends boolean>(returnString: T): string | number {
//   return returnString ? String(Math.random()) : Math.random();
// }

// function getStatsById(userId: string, timeWindow: TimeWindow, convertJSONOutput: true): Promise<IPlayerStats>;
// function getStatsById(userId: string, timeWindow: TimeWindow, convertJSONOutput: false): Promise<IStatsItem[]>;
// function getStatsById(
//     userId: string,
//     timeWindow: TimeWindow = TimeWindow.Alltime,
//     convertJSONOutput: boolean = true
//   ): Promise<IPlayerStats | IStatsItem[]>

// overrides to narrow type
function createOverviewLazyRouteFunction(
    index: false,
    componentName: string,
    section?: OverviewSection
): LazyRouteFunction<NonIndexRouteObject>
function createOverviewLazyRouteFunction(
    index: true,
    componentName: string,
    section?: OverviewSection
): LazyRouteFunction<IndexRouteObject>

function createOverviewLazyRouteFunction(
    index: boolean = false,
    componentName: string, //keyof typeof import('../../pages/overview/'),
    section?: OverviewSection
):
    | LazyRouteFunction<NonIndexRouteObject>
    | LazyRouteFunction<IndexRouteObject> {
    return async () => {
        const routeComponent = await import(`../../pages/overview/`)
        const name = componentName as keyof typeof routeComponent
        const Component = routeComponent[name]
        if (!Component && section) {
            return {
                element: <LegacyAppRedirect section={section} />,
            }
        }

        return {
            Component: routeComponent[name],
        }
    }
}

// overrides to narrow type
function createSectionLazyRouteFunction(
    index: false,
    section: Section,
    componentFileName: string
): LazyRouteFunction<NonIndexRouteObject>
function createSectionLazyRouteFunction(
    index: true,
    section: Section,
    componentFileName: string
): LazyRouteFunction<IndexRouteObject>

function createSectionLazyRouteFunction(
    index: boolean = false,
    section: Section,
    componentFileName: string
):
    | LazyRouteFunction<NonIndexRouteObject>
    | LazyRouteFunction<IndexRouteObject> {
    return async () => {
        try {
            return await import(
                `../../pages/${section.namePlural}/${componentFileName}`
            )
        } catch (e) {
            // means the component is not implemented yet
            // fallback to redirect to legacy
            if (isModuleNotFoundError(e)) {
                return {
                    element: (
                        <LegacyAppRedirect
                            section={section}
                            isNew={componentFileName === 'New'}
                        />
                    ),
                }
            }
            throw e
        }
    }
}

const VerifyModelId = () => {
    const { id } = useParams()

    if (!isValidUid(id)) {
        throw new Error('Invalid model id.')
    }
    return <Outlet />
}

const sectionsNoNewRoute = new Set<SchemaSection>([
    SECTIONS_MAP.categoryOptionCombo,
])

const schemaSectionRoutes = Object.values(SCHEMA_SECTIONS).map((section) => (
    <Route
        key={section.namePlural}
        path={getSectionPath(section)}
        handle={{
            section,
            crumb: () => (
                <BreadcrumbItem
                    section={OVERVIEW_SECTIONS[section.parentSectionKey]}
                />
            ),
        }}
        element={
            <>
                <Breadcrumbs />
                <Outlet />
            </>
        }
    >
        <Route
            index
            lazy={createSectionLazyRouteFunction(true, section, 'List')}
        />
        <Route
            handle={{
                hideSidebar: true,
                crumb: () => <BreadcrumbItem section={section} />,
            }}
        >
            {!sectionsNoNewRoute.has(section) && (
                <Route
                    path={routePaths.sectionNew}
                    lazy={createSectionLazyRouteFunction(false, section, 'New')}
                />
            )}
            <Route path=":id" element={<VerifyModelId />}>
                <Route
                    index
                    handle={{ showFooter: true }}
                    lazy={createSectionLazyRouteFunction(true, section, 'Edit')}
                />
            </Route>
        </Route>
    </Route>
))

const routes = createRoutesFromElements(
    <Route
        element={
            <QueryParamProvider adapter={ReactRouter6Adapter}>
                <Layout />
            </QueryParamProvider>
        }
        errorElement={<DefaultErrorRoute />}
    >
        <Route
            path="/"
            element={<Navigate to={routePaths.overviewRoot} replace />}
        />
        <Route element={<CheckAuthorityForSection />}>
            <Route path={routePaths.overviewRoot}>
                <Route
                    index
                    lazy={createOverviewLazyRouteFunction(true, 'AllOverview')}
                />
                {Object.values(OVERVIEW_SECTIONS).map((section) => (
                    <Route
                        key={section.name}
                        path={getSectionPath(section)}
                        lazy={createOverviewLazyRouteFunction(
                            false,
                            section.componentName,
                            section
                        )}
                        handle={{ section }}
                    />
                ))}
            </Route>
            {schemaSectionRoutes}
        </Route>
    </Route>
)

export const hashRouter = createHashRouter(routes)
export const ConfiguredRouter = () => {
    return <RouterProvider router={hashRouter} />
}
