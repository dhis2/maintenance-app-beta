import { CssReset } from '@dhis2/ui-core'
import { DataProvider } from '@dhis2/app-runtime'
import { HeaderBar } from '@dhis2/ui-widgets'
import React from 'react'
import { Maintenance } from './Maintenance.app.js'
import './App.css'

const App = () => (
    <DataProvider baseUrl={process.env.REACT_APP_DHIS2_BASE_URL} apiVersion="">
        <div className="wrapper">
            <HeaderBar appName="Maintenance app" />
            <Maintenance />
        </div>
        <CssReset />
    </DataProvider>
)

export default App
