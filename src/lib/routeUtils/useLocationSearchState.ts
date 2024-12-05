import { useCallback, useMemo } from 'react'
import {
    Location,
    NavigateOptions,
    To,
    useLocation,
    useNavigate,
} from 'react-router-dom'

/*  We use location.state to transiently save search-params between pages.
    Eg. when a user navigates from a list to a form, we can save the previously active filter-state
    in location.state when navigating. This will "remove" the query-params from the URL in the form-page.
    When navigating back to the list through a link, we reapply this saved state using `useNavigateWithSearchState` below.
    Using the browsers-back button should have the same behaviour, since the query-params are part of the history. */

type LocationSearchState = {
    search?: string
} | null

const createLocationState = (search: string): LocationSearchState => ({
    search,
})

const applySearchState = (to: To, locationSearchState: LocationSearchState) => {
    if (typeof to === 'string') {
        return { pathname: to, search: locationSearchState?.search }
    }
    return { ...to, search: to.search || locationSearchState?.search }
}

/**
 * Use this to preserve the current search-state between pages.
 * Pass the returned state to Link components or as options to navigate as "state"-property.
 * @returns an object that holds the current search-state.
 */
export const useLocationSearchState = () => {
    const location = useLocation()

    return useMemo(
        () => createLocationState(location.search),
        [location.search]
    )
}

export const useLocationState = <State>(state: State) => {
    const locationSearchState = useLocationSearchState()

    return { ...state, ...locationSearchState }
}

/** This is just a type-wrapper, applying the LocationSearchState type to useLocation  */
export const useLocationWithSearchState: () => Location<LocationSearchState> =
    useLocation
export const useLocationWithState: <
    State extends Record<string, unknown>
>() => Location<(LocationSearchState & Partial<State>) | null> = useLocation
/**
 * Wraps react-router "useNavigate" to include the search state as query-Paramters, retrieved from the location state.
 *
 * Use this to reapply the saved search-state when navigating between pages.
 *
 * Note that the current route has to include the search state in the location state,
 * which can be achieved by passing "state" to Link components or as options to navigate.
 * This will put the transiently saved search-state back in as active search-params (eg. result in query-Params in the URL).
 * @returns
 */
export const useNavigateWithSearchState = () => {
    const location = useLocationWithSearchState()

    const navigate = useNavigate()

    const overiddenNavigate = useCallback(
        (to: To, options?: NavigateOptions) => {
            const toWithSearchState = applySearchState(to, location.state)
            return navigate(toWithSearchState, options)
        },
        [navigate, location.state]
    )
    return overiddenNavigate
}

/* Helper-hook to create a "to"-object that can be passed to react-router Link components (and navigate).
    Use this to re-apply the saved-search-state when navigating between pages. */
export const useToWithSearchState = (to: To) => {
    const location = useLocationWithSearchState()
    return useMemo(() => {
        return applySearchState(to, location.state)
    }, [to, location.state])
}
