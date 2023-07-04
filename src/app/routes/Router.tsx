import React from 'react'
import {
    createHashRouter,
    RouterProvider,
    Outlet,
    Navigate,
    Route,
    createRoutesFromElements,
    LazyRouteFunction,
    RouteObject,
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
} from '../../constants'
import { isValidUid, isModuleNotFoundError } from '../../lib'
import { OverviewSection } from '../../types'
import { Layout } from '../layout'
import { CheckAuthorityForSection } from './CheckAuthorityForSection'
import { DefaultErrorRoute } from './DefaultErrorRoute'
import { LegacyAppRedirect } from './LegacyAppRedirect'
import { getSectionPath, routePaths } from './routePaths'
// This loads all the overview routes in the same chunk since they resolve to the same promise
// see https://reactrouter.com/en/main/route/lazy#multiple-routes-in-a-single-file
// Overviews are small, and the AllOverview would load all the other overviews anyway,
// so it's propbably better to load them all at once
function createOverviewLazyRouteFunction(
    componentName: string, //keyof typeof import('../../pages/overview/'),
    section?: OverviewSection
): LazyRouteFunction<RouteObject> {
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

function createSectionLazyRouteFunction(
    section: Section,
    componentFileName: string
): LazyRouteFunction<RouteObject> {
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
        handle={{ section }}
    >
        <Route index lazy={createSectionLazyRouteFunction(section, 'List')} />
        <Route handle={{ hideSidebar: true }}>
            {!sectionsNoNewRoute.has(section) && (
                <Route
                    path={routePaths.sectionNew}
                    lazy={createSectionLazyRouteFunction(section, 'New')}
                />
            )}
            <Route path=":id" element={<VerifyModelId />}>
                <Route
                    index
                    lazy={createSectionLazyRouteFunction(section, 'Edit')}
                ></Route>
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
                    lazy={createOverviewLazyRouteFunction('AllOverview')}
                />
                {Object.values(OVERVIEW_SECTIONS).map((section) => (
                    <Route
                        key={section.name}
                        path={getSectionPath(section)}
                        lazy={createOverviewLazyRouteFunction(
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
