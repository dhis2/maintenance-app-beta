jest.mock('../configureStore')

import {
    getUserAuthorities,
    getUserAuthoritiesLoading,
    getUserAuthoritiesLoaded,
    getUserAuthoritiesError,
    getUserAuthoritiesData,
    loadingUserAuthoritiesError,
    loadUserAuthorities,
    setUserAuthorities,
    startLoadingUserAuthorities,
    userAuthorities as reducer,
    userAuthoritiesDefaultState as defaultState,
} from '../userAuthority'
import { configureStore } from '../configureStore'

const userAuthorities = ['F_FOO_PUBLIC_CREATE']

describe('Thunk - loadUserAuthorities', () => {
    const engine = {
        query: jest.fn(() => Promise.resolve({ userAuthorities })),
    }
    const store = configureStore(engine)

    beforeEach(() => {
        store.clearActions()
    })

    afterEach(() => {
        engine.query.mockClear()
    })

    it('should dispatch a loading user authorities start action', done => {
        const expectedActions = expect.arrayContaining([
            startLoadingUserAuthorities(),
        ])

        store.dispatch(loadUserAuthorities()).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
            done()
        })
    })

    it('should dispatch a set userAuthorities action when done loading', done => {
        const expectedActions = expect.arrayContaining([
            setUserAuthorities(userAuthorities),
        ])

        store.dispatch(loadUserAuthorities()).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
            done()
        })
    })

    it('should dispatch a loading userAuthorities error action when an error occurred', done => {
        const error = 'An error occurred'
        engine.query.mockImplementationOnce(() =>
            Promise.reject(new Error(error))
        )
        const expectedActions = expect.arrayContaining([
            loadingUserAuthoritiesError(error),
        ])

        store.dispatch(loadUserAuthorities()).then(() => {
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

    it('should set the loaded state to true when it is false and a setUserAuthorities action has been dispatched', () => {
        const state = { ...defaultState, loaded: false }
        const action = setUserAuthorities(userAuthorities)
        const expected = expect.objectContaining({ loaded: true })
        const actual = reducer(state, action)

        expect(actual).toEqual(expected)
    })

    it('should not override the loaded state to true when it is true and userAuthorities are being loaded again', () => {
        const state = { ...defaultState, loaded: true }
        const action = startLoadingUserAuthorities()
        const expected = expect.objectContaining({ loaded: true })
        const actual = reducer(state, action)

        expect(actual).toEqual(expected)
    })

    it('should set loading to true and error to null when starting to load userAuthorities', () => {
        const state = {
            ...defaultState,
            loading: false,
            error: 'Previous error',
        }
        const action = startLoadingUserAuthorities()
        const expected = { ...state, loading: true, error: null }
        const actual = reducer(state, action)

        expect(actual).toEqual(expected)
    })

    it('should set loading to false and override the data when a setUserAuthorities action has been dispatched', () => {
        const state = {
            ...defaultState,
            loaded: true,
            loading: true,
            data: null,
        }
        const action = setUserAuthorities(userAuthorities)
        const expected = { ...state, loading: false, data: userAuthorities }
        const actual = reducer(state, action)

        expect(actual).toEqual(expected)
    })

    it('should set the error and loading to false when a load userAuthorities error action is dispatched', () => {
        const error = 'An error occureed'
        const state = { ...defaultState, loading: true, error: null }
        const action = loadingUserAuthoritiesError(error)
        const expected = { ...state, loading: false, error }
        const actual = reducer(state, action)

        expect(actual).toEqual(expected)
    })
})

describe('Selectors', () => {
    const state = { userAuthorities: defaultState }

    it('should get the userAuthorities', () => {
        expect(getUserAuthorities(state)).toEqual(defaultState)
    })

    it('should get the loading state', () => {
        expect(getUserAuthoritiesLoading(state)).toEqual(defaultState.loading)
    })

    it('should get the loaded state', () => {
        expect(getUserAuthoritiesLoaded(state)).toEqual(defaultState.loaded)
    })

    it('should get the error state', () => {
        expect(getUserAuthoritiesError(state)).toEqual(defaultState.error)
    })

    it('should get the data state', () => {
        expect(getUserAuthoritiesData(state)).toEqual(defaultState.data)
    })
})
