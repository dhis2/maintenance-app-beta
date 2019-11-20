import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import React, { useEffect } from 'react'

import { All } from './views/All'
import { DataElementList } from './views/dataElement/DataElementList'
import { Navigation } from './modules/Navigation/Navigation'
import { Overview } from './views/Overview'
import { ProtectedRoute } from './modules/Navigation/ProtectedRoute'
import { RedirectToOld } from './views/RedirectToOld'
import { Error } from './views/Error'
import { Loading } from './views/Loading'
import {
    getAppDataError,
    getAppLoading,
    getAppReady,
    loadAppData,
} from './redux/app'
import { dataElementSections } from './config/sections'

export const Router = () => {
    const dispatch = useDispatch()
    const appReady = useSelector(getAppReady)
    const appLoading = useSelector(getAppLoading)
    const appError = useSelector(getAppDataError)

    useEffect(() => {
        if (!appLoading && !appReady && !appError) {
            dispatch(loadAppData())
        }
    }, [appLoading, appReady, appError, dispatch])

    if (appError) {
        return <Error error={appError} />
    }

    if (!appReady) {
        return <Loading />
    }

    return (
        <BrowserRouter>
            <Route path="/" component={Navigation} />

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
                     * All group overview views
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
                    permissions={dataElementSections.dataElement.permissions}
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
        </BrowserRouter>
    )
}
