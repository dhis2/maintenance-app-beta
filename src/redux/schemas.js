import { isEqual } from 'lodash/fp'

/**
 * Actions types
 * =============
 */

export const SCHEMAS_LOAD_START = 'SCHEMAS_LOAD_START'
export const SCHEMAS_LOAD_ERROR = 'SCHEMAS_LOAD_ERROR'
export const SCHEMAS_SET = 'SCHEMAS_SET'

/**
 * Action creators
 * ===============
 */

export const startLoadingSchemas = () => ({
    type: SCHEMAS_LOAD_START,
})

export const loadingSchemasError = error => ({
    type: SCHEMAS_LOAD_ERROR,
    payload: { error },
})

export const setSchemas = schemas => ({
    type: SCHEMAS_SET,
    payload: { schemas },
})

/**
 * Thunks
 * ======
 */

const query = { schemas: { resource: 'schemas' } }

export const loadSchemas = () => (dispatch, getState, { engine }) => {
    dispatch(startLoadingSchemas())

    return engine
        .query(query)
        .then(data => {
            const { schemas } = data.schemas
            const formattedSchemas = schemas.reduce((formatted, curSchema) => {
                formatted[curSchema.collectionName] = curSchema
                return formatted
            }, {})

            dispatch(setSchemas(formattedSchemas))
        })
        .catch(error => dispatch(loadingSchemasError(error)))
}

/**
 * Reducer
 * =======
 */

export const schemas = (
    state = {
        loading: false,
        loaded: true,
        error: null,
        data: null,
    },
    { type, payload }
) => {
    const isType = isEqual(type)

    if (isType(SCHEMAS_LOAD_START)) {
        return { ...state, loading: true, error: null }
    }

    if (isType(SCHEMAS_LOAD_ERROR)) {
        return { ...state, loading: false, error: payload.error }
    }

    if (isType(SCHEMAS_SET)) {
        return {
            ...state,
            loading: false,
            loaded: true,
            data: payload.schemas,
        }
    }

    return state
}

/**
 * Selectors
 * =========
 */

export const getSchemas = state => state.schemas

export const getSchemasLoading = state => getSchemas(state).loading

export const getSchemasLoaded = state => getSchemas(state).loaded

export const getSchemasError = state => getSchemas(state).error

export const getSchemasData = state => getSchemas(state).data
