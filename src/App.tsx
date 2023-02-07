import React from 'react'
import { DataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
// import classes from './App.module.css'
import { Layout, AppWrapper, ConfiguredRouter } from './app/'


const query = {
    me: {
        resource: 'me',
    },
}

const MyApp = () => (
    <AppWrapper>
         <ConfiguredRouter />
    </AppWrapper>
   
)

export default MyApp
