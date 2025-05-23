import type { UIMatch, useMatches } from 'react-router-dom'
import type { ModelSection, OverviewSection } from '../../types'
// utility type to type a match with a handle-property returned from useMatches
// since handle is unknown, we need to cast it to the correct type
type MatchWithHandle<THandle> = ReturnType<typeof useMatches>[number] & {
    handle?: THandle
}

export type BreadCrumbMatchInfo = Pick<UIMatch, 'params' | 'pathname'>

// common type for possible handle-properties used in Route
export type RouteHandle = {
    hideSidebar?: boolean
    section?: ModelSection | OverviewSection
    crumb?: (matchInfo: BreadCrumbMatchInfo) => React.ReactNode
}

export type MatchRouteHandle = MatchWithHandle<RouteHandle>
