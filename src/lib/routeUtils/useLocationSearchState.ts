import { useTo } from './useLocationSearchState'
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

export const createLocationState = (search: string): LocationSearchState => ({
    search,
})

const applySearchState = (to: To, location: LocationSearchState) => {
    if (typeof to === 'string') {
        return { pathname: to, search: location?.search }
    }
    return { ...to, search: to.search || location?.search }
}

export const useCreateLocationSearchState = () => {
    const location = useLocation()

    return useMemo(
        () => createLocationState(location.search),
        [location.search]
    )
}

/** This is just a type-wrapper, applying the LocationSearchState type to useLocation  */
export const useLocationWithSearchState = (): Location<LocationSearchState> => {
    return useLocation()
}

/**
 * Wraps react-router "useNavigate" to include the search state as query-Paramters, retrieved from the location state.
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

export const useToWithSearchState = (to: To) => {
    const location = useLocationWithSearchState()

    return useMemo(() => {
        return applySearchState(to, location.state)
    }, [to, location.state])
}
