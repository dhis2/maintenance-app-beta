import {
    getSchemasError,
    getSchemasLoaded,
    getSchemasLoading,
    loadSchemas,
} from './schemas'
import {
    getSystemSettingsError,
    getSystemSettingsLoaded,
    getSystemSettingsLoading,
    loadSystemSettings,
} from './systemSettings'
import {
    getUserAuthoritiesError,
    getUserAuthoritiesLoaded,
    getUserAuthoritiesLoading,
    loadUserAuthorities,
} from './userAuthority'

/**
 * Thunks
 * ======
 */

export const loadAppData = () => dispatch =>
    Promise.all([
        dispatch(loadSchemas()),
        dispatch(loadSystemSettings()),
        dispatch(loadUserAuthorities()),
    ])

/**
 * Selectors
 * =========
 */

export const getAppReady = state =>
    !getSchemasLoading(state) &&
    getSchemasLoaded(state) &&
    !getSystemSettingsLoading(state) &&
    getSystemSettingsLoaded(state) &&
    !getUserAuthoritiesLoading(state) &&
    getUserAuthoritiesLoaded(state)

export const getAppLoading = state =>
    getSchemasLoading(state) ||
    getSystemSettingsLoading(state) ||
    getUserAuthoritiesLoading(state)

export const getAppDataError = state =>
    getSchemasError(state) ||
    getSystemSettingsError(state) ||
    getUserAuthoritiesError(state)
