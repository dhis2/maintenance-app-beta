import { applyMiddleware, compose, createStore } from 'redux'
import { createBrowserHistory } from 'history'
import thunk from 'redux-thunk'

import { rootReducer } from './rootReducer'

export const history = createBrowserHistory()

export const configureStore = (engine, initialState) => {
    const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : compose

    const store = createStore(
        rootReducer,
        initialState,
        composeEnhancer(applyMiddleware(thunk.withExtraArgument({ engine })))
    )

    return store
}
