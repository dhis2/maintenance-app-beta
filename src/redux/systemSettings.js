import { isEqual } from 'lodash/fp'

/**
 * Actions types
 * =============
 */

export const SYSTEM_SETTINGS_LOAD_START = 'SYSTEM_SETTINGS_LOAD_START'
export const SYSTEM_SETTINGS_LOAD_ERROR = 'SYSTEM_SETTINGS_LOAD_ERROR'
export const SYSTEM_SETTINGS_SET = 'SYSTEM_SETTINGS_SET'

/**
 * Action creators
 * ===============
 */

export const startLoadingSystemSettings = () => ({
    type: SYSTEM_SETTINGS_LOAD_START,
})

export const loadingSystemSettingsError = error => ({
    type: SYSTEM_SETTINGS_LOAD_ERROR,
    payload: { error },
})

export const setSystemSettings = systemSettings => ({
    type: SYSTEM_SETTINGS_SET,
    payload: { systemSettings },
})

/**
 * Thunks
 * ======
 */

const query = { systemSettings: { resource: 'systemSettings' } }
export const loadSystemSettings = () => (dispatch, getState, { engine }) => {
    dispatch(startLoadingSystemSettings())

    return engine
        .query(query)
        .then(({ systemSettings }) =>
            dispatch(setSystemSettings(systemSettings))
        )
        .catch(error => dispatch(loadingSystemSettingsError(error)))
}

/**
 * Reducer
 * =======
 */

export const systemSettings = (
    state = {
        loading: false,
        loaded: false,
        error: null,
        data: null,
    },
    { type, payload }
) => {
    const isType = isEqual(type)

    if (isType(SYSTEM_SETTINGS_LOAD_START)) {
        return { ...state, loading: true, error: null }
    }

    if (isType(SYSTEM_SETTINGS_LOAD_ERROR)) {
        return { ...state, loading: false, error: payload.error }
    }

    if (isType(SYSTEM_SETTINGS_SET)) {
        return {
            ...state,
            loading: false,
            loaded: true,
            data: payload.systemSettings,
        }
    }

    return state
}

/**
 * Selectors
 * =========
 */

export const getSystemSettings = state => state.systemSettings

export const getSystemSettingsLoading = state =>
    getSystemSettings(state).loading

export const getSystemSettingsLoaded = state => getSystemSettings(state).loaded

export const getSystemSettingsError = state => getSystemSettings(state).error

export const getSystemSettingsData = state => getSystemSettings(state).data
