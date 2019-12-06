import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import React, { useEffect } from 'react'

import { dataElementSections } from './config'
import { Navigation, ProtectedRoute } from './modules'
import {
    getAppDataError,
    getAppLoading,
    getAppReady,
    loadAppData,
} from './redux'
import {
    All,
    DataElementList,
    Overview,
    RedirectToOld,
    Error,
    Loading,
} from './views'

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
                     */ ''
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
                     */ ''
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
                     */ ''
                }
                <ProtectedRoute
                    exact
                    path={dataElementSections.dataElement.path}
                    component={DataElementList}
                    section={dataElementSections.dataElement}
                />

                {
                    /**
                     * =============================
                     * 404 - Redirect to old app
                     * =============================
                     */ ''
                }
                <Route component={RedirectToOld} />
            </Switch>
        </BrowserRouter>
    )
}
