import { isEqual } from 'lodash/fp'

/**
 * Actions types
 * =============
 */

export const USER_AUTHORITIES_LOAD_START = 'USER_AUTHORITIES_LOAD_START'
export const USER_AUTHORITIES_LOAD_ERROR = 'USER_AUTHORITIES_LOAD_ERROR'
export const USER_AUTHORITIES_SET = 'USER_AUTHORITIES_SET'

/**
 * Action creators
 * ===============
 */

export const startLoadingUserAuthorities = () => ({
    type: USER_AUTHORITIES_LOAD_START,
})

export const loadingUserAuthoritiesError = error => ({
    type: USER_AUTHORITIES_LOAD_ERROR,
    payload: { error },
})

export const setUserAuthorities = userAuthorities => ({
    type: USER_AUTHORITIES_SET,
    payload: { userAuthorities },
})

/**
 * Thunks
 * ======
 */

const query = { userAuthorities: { resource: 'me/authorities' } }
export const loadUserAuthorities = () => (dispatch, getState, { engine }) => {
    dispatch(startLoadingUserAuthorities())

    return engine
        .query(query)
        .then(({ userAuthorities }) =>
            dispatch(setUserAuthorities(userAuthorities))
        )
        .catch(error => dispatch(loadingUserAuthoritiesError(error)))
}

/**
 * Reducer
 * =======
 */

export const userAuthorities = (
    state = {
        loading: false,
        loaded: false,
        error: null,
        data: null,
    },
    { type, payload }
) => {
    const isType = isEqual(type)

    if (isType(USER_AUTHORITIES_LOAD_START)) {
        return { ...state, loading: true, error: null }
    }

    if (isType(USER_AUTHORITIES_LOAD_ERROR)) {
        return { ...state, loading: false, error: payload.error }
    }

    if (isType(USER_AUTHORITIES_SET)) {
        return {
            ...state,
            loading: false,
            loaded: true,
            data: payload.userAuthorities,
        }
    }

    return state
}

/**
 * Selectors
 * =========
 */

export const getUserAuthorities = state => state.userAuthorities

export const getUserAuthoritiesLoading = state =>
    getUserAuthorities(state).loading

export const getUserAuthoritiesLoaded = state =>
    getUserAuthorities(state).loaded

export const getUserAuthoritiesError = state => getUserAuthorities(state).error

export const getUserAuthoritiesData = state => getUserAuthorities(state).data
