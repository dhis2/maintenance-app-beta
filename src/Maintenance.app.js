import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch, Link } from 'react-router-dom'
import { Provider } from 'react-redux'
import React from 'react'

import { createUrl } from './constants/internalLinks'
import { configureStore, history } from './redux/configureStore'
import { ProtectedRoute } from './components/authorization/ProtectedRoute'
import { Navigation } from './components/Navigation'
import { DataElementList } from './pages/dataElement/DataElementList'
import { sections } from './constants/sections'

const store = configureStore()
const { dataElement } = sections

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

            <Navigation />

            <Switch>
                <ProtectedRoute
                    exact
                    path={dataElement.sections.dataElement.path}
                    permissions={dataElement.sections.dataElement.permissions}
                    component={DataElementList}
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
