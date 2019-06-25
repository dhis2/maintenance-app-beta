import { applyMiddleware, compose, createStore } from 'redux'
import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk'

import { createRootReducer } from './createRootReducer'

export const history = createBrowserHistory()

export const configureStore = initialState => {
    const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : compose

    const store = createStore(
        createRootReducer(history),
        initialState,
        composeEnhancer(applyMiddleware(routerMiddleware(history), thunk))
    )

    return store
}
