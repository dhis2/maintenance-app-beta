import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom';
import React from 'react';

import { DataElementsList } from './pages/dataElements/DataElementsList';
import { createUrl } from './config/internalLinks';

export const Maintenance = () => (
    <Router>
        <div>
            Dev section... (will be replaced with the navigation)<br />
            <Link to="/">Home</Link><br />
            <Link to="/list/dataElementSection/dataElement">Data element list section</Link><br />
            <br />
        </div>
        <Switch>
            <Route
                exact
                path="/list/dataElementSection/dataElement"
                component={DataElementsList}
            />
            <Route
                component={({ location }) => {
                    return `Should redirect to, ${createUrl(location.pathname)}`
                }}
            />
        </Switch>
    </Router>
)
