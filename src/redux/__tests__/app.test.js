jest.mock('../configureStore.js')

import {
    getAppReady,
    //getAppLoading,
    //getAppDataError,
    loadAppData,
} from '../app'
import * as schemas from '../schemas'
import * as systemSettings from '../systemSettings'
import * as userAuthorities from '../userAuthority'
import { configureStore } from '../configureStore'

schemas.loadSchemas = jest.fn(() => dispatch => {
    dispatch({ type: 'LOAD_SCHEMAS' })
    return Promise.resolve()
})

systemSettings.loadSystemSettings = jest.fn(() => dispatch => {
    dispatch({ type: 'LOAD_SYSTEM_SETTINGS' })
    return Promise.resolve()
})

userAuthorities.loadUserAuthorities = jest.fn(() => dispatch => {
    dispatch({ type: 'LOAD_USER_AUTHORITIES' })
    return Promise.resolve()
})

describe('Thunk - loadAppData', () => {
    const store = configureStore()

    beforeEach(() => {
        store.clearActions()
    })

    it('should dispatch actions for loading initial data', done => {
        const expectedActions = expect.arrayContaining([
            { type: 'LOAD_SCHEMAS' },
            { type: 'LOAD_SYSTEM_SETTINGS' },
            { type: 'LOAD_USER_AUTHORITIES' },
        ])

        store.dispatch(loadAppData()).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
            done()
        })
    })
})

describe('Selectors', () => {
    let state
    const appReadyState = {
        schemas: { loading: false, loaded: true },
        systemSettings: { loading: false, loaded: true },
        userAuthorities: { loading: false, loaded: true },
    }

    it('should return that app is ready when conditions are met', () => {
        expect(getAppReady(appReadyState)).toBe(true)
    })

    it('should return that app is not ready when schemas are loading', () => {
        state = {
            ...appReadyState,
            schemas: {
                ...appReadyState.schemas,
                loading: true,
            },
        }

        expect(getAppReady(state)).toBe(false)
    })

    it('should return that app is not ready when schemas are not loaded', () => {
        state = {
            ...appReadyState,
            schemas: {
                ...appReadyState.schemas,
                loaded: false,
            },
        }

        expect(getAppReady(state)).toBe(false)
    })

    it('should return that app is not ready when systemSettings are loading', () => {
        state = {
            ...appReadyState,
            systemSettings: {
                ...appReadyState.systemSettings,
                loading: true,
            },
        }

        expect(getAppReady(state)).toBe(false)
    })

    it('should return that app is not ready when systemSettings are not loaded', () => {
        state = {
            ...appReadyState,
            systemSettings: {
                ...appReadyState.systemSettings,
                loaded: false,
            },
        }

        expect(getAppReady(state)).toBe(false)
    })

    it('should return that app is not ready when userAuthorities are loading', () => {
        state = {
            ...appReadyState,
            userAuthorities: {
                ...appReadyState.userAuthorities,
                loading: true,
            },
        }

        expect(getAppReady(state)).toBe(false)
    })

    it('should return that app is not ready when userAuthorities are not loaded', () => {
        state = {
            ...appReadyState,
            userAuthorities: {
                ...appReadyState.userAuthorities,
                loaded: false,
            },
        }

        expect(getAppReady(state)).toBe(false)
    })
})
