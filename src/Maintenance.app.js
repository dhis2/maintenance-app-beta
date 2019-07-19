import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'
import React from 'react'

import { All } from './pages/All'
import { DataElementList } from './pages/dataElement/DataElementList'
import { Navigation } from './components/Navigation'
import { Overview } from './pages/Overview'
import { ProtectedRoute } from './components/authorization/ProtectedRoute'
import { RedirectToOld } from './pages/RedirectToOld'
import { configureStore, history } from './redux/configureStore'
import { dataElementSections } from './constants/groups_and_sections'
import styles from './Maintenance.module.css'

const store = configureStore()

export const Maintenance = () => (
    <div className={styles.maintenanceApp}>
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <Navigation />

                <Switch>
                    {
                        /**
                         * =============================
                         * Home
                         * =============================
                         * */ ''
                    }
                    <Route
                        exact
                        path="/"
                        component={() => <Redirect to="/list/all" />}
                    />

                    <Route exact path="/list/all" component={All} />

                    {
                        /**
                         * =============================
                         * All group overview pages
                         * =============================
                         * */ ''
                    }
                    <Route
                        exact
                        path="/list/:group(.*)Section"
                        component={Overview}
                    />

                    {
                        /**
                         * =============================
                         * Data Element
                         * =============================
                         * */ ''
                    }
                    <ProtectedRoute
                        exact
                        path={dataElementSections.dataElement.path}
                        schemaName={dataElementSections.dataElement.schemaName}
                        permissions={
                            dataElementSections.dataElement.permissions
                        }
                        component={DataElementList}
                    />

                    {
                        /**
                         * =============================
                         * 404 - Redirect to old app
                         * =============================
                         * */ ''
                    }
                    <Route component={RedirectToOld} />
                </Switch>
            </ConnectedRouter>
        </Provider>
    </div>
)
