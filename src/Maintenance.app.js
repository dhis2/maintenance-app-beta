import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch, Link } from 'react-router-dom'
import { Provider } from 'react-redux'
import React from 'react'

import { DataElementsList } from './pages/dataElements/DataElementsList'
import { ProtectedRoute } from './components/authorization/ProtectedRoute'
import { createUrl } from './constants/internalLinks'
import { sections } from './pages/dataElements/sections'
import { configureStore, history } from './redux/configureStore'

const store = configureStore()

export const Maintenance = () => (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <div>
                Dev section... (will be replaced with the navigation)
                <br />
                <Link to="/">Home</Link>
                <br />
                <Link to="/list/dataElementSection/dataElement">
                    Data element list section
                </Link>
                <br />
                <br />
            </div>

            <Switch>
                <ProtectedRoute
                    exact
                    path={sections.dataElements.path}
                    permissions={sections.dataElements.permissions}
                    component={DataElementsList}
                />

                <Route
                    component={({ location }) => {
                        return `Should redirect to, ${createUrl(
                            location.pathname
                        )}`
                    }}
                />
            </Switch>
        </ConnectedRouter>
    </Provider>
)
