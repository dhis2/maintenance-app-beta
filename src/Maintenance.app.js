import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'
import React from 'react'

import { All } from './pages/All'
import { DataElementList } from './pages/dataElement/DataElementList'
import { Navigation } from './components/Navigation'
import { Overview } from './pages/Overview'
import { ProtectedRoute } from './components/authorization/ProtectedRoute'
import { configureStore, history } from './redux/configureStore'
import { createUrl } from './constants/internalLinks'
import { sections } from './constants/sections'
import { subSectionOrder } from './constants/sectionOrder'
import styles from './Maintenance.module.css'

const store = configureStore()
const { dataElement } = sections

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
                         * Data Element
                         * =============================
                         * */ ''
                    }
                    <Route
                        exact
                        path={dataElement.path}
                        render={() => (
                            <Overview
                                name={dataElement.name}
                                sections={subSectionOrder.dataElement}
                            />
                        )}
                    />

                    <ProtectedRoute
                        exact
                        path={dataElement.sections.dataElement.path}
                        permissions={
                            dataElement.sections.dataElement.permissions
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
    </div>
)
