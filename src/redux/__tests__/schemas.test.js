jest.mock('../configureStore')

import {
    getSchemas,
    getSchemasLoading,
    getSchemasLoaded,
    getSchemasError,
    getSchemasData,
    loadingSchemasError,
    loadSchemas,
    schemas as reducer,
    schemasDefaultState as defaultState,
    setSchemas,
    startLoadingSchemas,
} from '../schemas'
import { configureStore } from '../configureStore'

const schemas = [
    {
        collectionName: 'organisationUnits',
        authorities: [
            {
                type: 'FOO',
                authorities: ['F_ORGANISATION_UNIT_FOO'],
            },
        ],
    },
]
const formattedSchemas = { organisationUnits: schemas[0] }

describe('Thunk - loadSchemas', () => {
    const engine = {
        query: jest.fn(() => Promise.resolve({ schemas: { schemas } })),
    }
    const store = configureStore(engine)

    beforeEach(() => {
        store.clearActions()
    })

    afterEach(() => {
        engine.query.mockClear()
    })

    it('should dispatch a loading schemas start action', done => {
        const expectedActions = expect.arrayContaining([startLoadingSchemas()])

        store.dispatch(loadSchemas()).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
            done()
        })
    })

    it('should dispatch a set schemas action when done loading', done => {
        const expectedActions = expect.arrayContaining([
            setSchemas(formattedSchemas),
        ])

        store.dispatch(loadSchemas()).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
            done()
        })
    })

    it('should dispatch a loading schemas error action when an error occurred', done => {
        const error = 'An error occurred'
        engine.query.mockImplementationOnce(() =>
            Promise.reject(new Error(error))
        )
        const expectedActions = expect.arrayContaining([
            loadingSchemasError(error),
        ])

        store.dispatch(loadSchemas()).then(() => {
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

    it('should set the loaded state to true when it is false and a setSchemas action has been dispatched', () => {
        const state = { ...defaultState, loaded: false }
        const action = setSchemas(formattedSchemas)
        const expected = expect.objectContaining({ loaded: true })
        const actual = reducer(state, action)

        expect(actual).toEqual(expected)
    })

    it('should not override the loaded state to true when it is true and schemas are being loaded again', () => {
        const state = { ...defaultState, loaded: true }
        const action = startLoadingSchemas()
        const expected = expect.objectContaining({ loaded: true })
        const actual = reducer(state, action)

        expect(actual).toEqual(expected)
    })

    it('should set loading to true and error to null when starting to load schemas', () => {
        const state = {
            ...defaultState,
            loading: false,
            error: 'Previous error',
        }
        const action = startLoadingSchemas()
        const expected = { ...state, loading: true, error: null }
        const actual = reducer(state, action)

        expect(actual).toEqual(expected)
    })

    it('should set loading to false and override the data when a setSchemas action has been dispatched', () => {
        const state = {
            ...defaultState,
            loaded: true,
            loading: true,
            data: null,
        }
        const action = setSchemas(formattedSchemas)
        const expected = { ...state, loading: false, data: formattedSchemas }
        const actual = reducer(state, action)

        expect(actual).toEqual(expected)
    })

    it('should set the error and loading to false when a load schemas error action is dispatched', () => {
        const error = 'An error occureed'
        const state = { ...defaultState, loading: true, error: null }
        const action = loadingSchemasError(error)
        const expected = { ...state, loading: false, error }
        const actual = reducer(state, action)

        expect(actual).toEqual(expected)
    })
})

describe('Selector', () => {
    const state = { schemas: defaultState }

    it('should get the schemas', () => {
        expect(getSchemas(state)).toEqual(defaultState)
    })

    it('should get the loading state', () => {
        expect(getSchemasLoading(state)).toEqual(defaultState.loading)
    })

    it('should get the loaded state', () => {
        expect(getSchemasLoaded(state)).toEqual(defaultState.loaded)
    })

    it('should get the error state', () => {
        expect(getSchemasError(state)).toEqual(defaultState.error)
    })

    it('should get the data state', () => {
        expect(getSchemasData(state)).toEqual(defaultState.data)
    })
})
