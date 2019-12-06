jest.mock('../configureStore')

import {
    getSystemSettings,
    getSystemSettingsLoading,
    getSystemSettingsLoaded,
    getSystemSettingsError,
    getSystemSettingsData,
    loadingSystemSettingsError,
    loadSystemSettings,
    setSystemSettings,
    startLoadingSystemSettings,
    systemSettings as reducer,
    systemSettingsDefaultState as defaultState,
} from '../systemSettings'
import { configureStore } from '../configureStore'

const systemSettings = { keyRequireAddToView: true }

describe('Thunk - loadSystemSettings', () => {
    const engine = { query: jest.fn(() => Promise.resolve({ systemSettings })) }
    const store = configureStore(engine)

    beforeEach(() => {
        store.clearActions()
    })

    afterEach(() => {
        engine.query.mockClear()
    })

    it('should dispatch a loading system settings start action', done => {
        const expectedActions = expect.arrayContaining([
            startLoadingSystemSettings(),
        ])

        store.dispatch(loadSystemSettings()).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
            done()
        })
    })

    it('should dispatch a set systemSettings action when done loading', done => {
        const expectedActions = expect.arrayContaining([
            setSystemSettings(systemSettings),
        ])

        store.dispatch(loadSystemSettings()).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
            done()
        })
    })

    it('should dispatch a loading systemSettings error action when an error occurred', done => {
        const error = 'An error occurred'
        engine.query.mockImplementationOnce(() =>
            Promise.reject(new Error(error))
        )
        const expectedActions = expect.arrayContaining([
            loadingSystemSettingsError(error),
        ])

        store.dispatch(loadSystemSettings()).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
            done()
        })
    })
})

describe('Reducer', () => {
    it('should return the state if an unknown action has been dispatched', () => {
        const state = { ...defaultState }
        const action = { type: 'UNKNOWN_ACTION' }
        const expected = defaultState
        const actual = reducer(state, action)

        expect(actual).toEqual(expected)
    })

    it('should set the loaded state to true when it is false and a setSystemSettings action has been dispatched', () => {
        const state = { ...defaultState, loaded: false }
        const action = setSystemSettings(systemSettings)
        const expected = expect.objectContaining({ loaded: true })
        const actual = reducer(state, action)

        expect(actual).toEqual(expected)
    })

    it('should not override the loaded state to true when it is true and systemSettings are being loaded again', () => {
        const state = { ...defaultState, loaded: true }
        const action = startLoadingSystemSettings()
        const expected = expect.objectContaining({ loaded: true })
        const actual = reducer(state, action)

        expect(actual).toEqual(expected)
    })

    it('should set loading to true and error to null when starting to load systemSettings', () => {
        const state = {
            ...defaultState,
            loading: false,
            error: 'Previous error',
        }
        const action = startLoadingSystemSettings()
        const expected = { ...state, loading: true, error: null }
        const actual = reducer(state, action)

        expect(actual).toEqual(expected)
    })

    it('should set loading to false and override the data when a setSystemSettings action has been dispatched', () => {
        const state = {
            ...defaultState,
            loaded: true,
            loading: true,
            data: null,
        }
        const action = setSystemSettings(systemSettings)
        const expected = { ...state, loading: false, data: systemSettings }
        const actual = reducer(state, action)

        expect(actual).toEqual(expected)
    })

    it('should set the error and loading to false when a load systemSettings error action is dispatched', () => {
        const error = 'An error occureed'
        const state = { ...defaultState, loading: true, error: null }
        const action = loadingSystemSettingsError(error)
        const expected = { ...state, loading: false, error }
        const actual = reducer(state, action)

        expect(actual).toEqual(expected)
    })
})

describe('Selectors', () => {
    const state = { systemSettings: defaultState }

    it('should get the systemSettings', () => {
        expect(getSystemSettings(state)).toEqual(defaultState)
    })

    it('should get the loading state', () => {
        expect(getSystemSettingsLoading(state)).toEqual(defaultState.loading)
    })

    it('should get the loaded state', () => {
        expect(getSystemSettingsLoaded(state)).toEqual(defaultState.loaded)
    })

    it('should get the error state', () => {
        expect(getSystemSettingsError(state)).toEqual(defaultState.error)
    })

    it('should get the data state', () => {
        expect(getSystemSettingsData(state)).toEqual(defaultState.data)
    })
})
