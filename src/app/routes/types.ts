import type { useMatches } from "react-router-dom";
import type { Section } from "../../constants/sections";

// utility type to type a match with a handle-property returned from useMatches
// since handle is unknown, we need to cast it to the correct type
type MatchWithHandle<THandle> = ReturnType<typeof useMatches>[number] & { handle?: THandle };

// common type for possible handle-properties used in Route
export type RouteHandle = {
    hideSidebar?: boolean;
    section?: Section;
}

export type MatchRouteHandle = MatchWithHandle<RouteHandle>;