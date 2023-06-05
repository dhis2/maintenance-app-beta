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
import { SECTIONS_MAP, Section } from '../../constants'
import { isValidUid, isModuleNotFoundError } from '../../lib'
import { Layout } from '../layout'
import { DefaultErrorRoute } from './DefaultErrorRoute'
import { LegacyAppRedirect } from './LegacyAppRedirect'
import { getSectionPath, routePaths } from './routePaths'

// This loads all the overview routes in the same chunk since they resolve to the same promise
// see https://reactrouter.com/en/main/route/lazy#multiple-routes-in-a-single-file
// Overviews are small, and the AllOverview would load all the other overviews anyway,
// so it's propbably better to load them all at once
function createOverviewLazyRouteFunction(
    componentName: keyof typeof import('../../pages/overview/')
): LazyRouteFunction<RouteObject> {
    return async () => {
        const routeComponent = await import(`../../pages/overview/`)
        return {
            Component: routeComponent[componentName],
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

const sectionsNoEditRoute = new Set<Section>([SECTIONS_MAP.locale])
const sectionsNoNewRoute = new Set<Section>([SECTIONS_MAP.categoryOptionCombo])

const sectionRoutes = Object.values(SECTIONS_MAP).map((section) => (
    <Route
        key={section.namePlural}
        path={getSectionPath(section)}
        handle={{ section }}
    >
        <Route index lazy={createSectionLazyRouteFunction(section, 'List')} />
        {!sectionsNoNewRoute.has(section) && (
            <Route
                path={routePaths.sectionNew}
                lazy={createSectionLazyRouteFunction(section, 'New')}
                handle={{
                    hideSidebar: true,
                }}
            />
        )}

        {!sectionsNoEditRoute.has(section) && (
            <Route path=":id" element={<VerifyModelId />}>
                <Route
                    index
                    lazy={createSectionLazyRouteFunction(section, 'Edit')}
                ></Route>
            </Route>
        )}
    </Route>
))

const routes = createRoutesFromElements(
    <Route element={<Layout />} errorElement={<DefaultErrorRoute />}>
        <Route
            path="/"
            element={<Navigate to={routePaths.overviewRoot} replace />}
        />
        <Route path={routePaths.overviewRoot}>
            <Route
                index
                lazy={createOverviewLazyRouteFunction('AllOverview')}
            />
            <Route
                path={getSectionPath(SECTIONS_MAP.dataElement)}
                lazy={createOverviewLazyRouteFunction('DataElements')}
            />
            <Route
                path={getSectionPath(SECTIONS_MAP.category)}
                lazy={createOverviewLazyRouteFunction('Categories')}
            />
        </Route>
        {sectionRoutes}
    </Route>
)

export const hashRouter = createHashRouter(routes)

export const ConfiguredRouter = () => {
    return <RouterProvider router={hashRouter} />
}
