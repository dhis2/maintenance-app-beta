import React from 'react'
import { DataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import classes from './App.module.css'
import { Layout, AppWrapper } from './app/'
import { Sidebar } from './sidebar/'

const query = {
    me: {
        resource: 'me',
    },
}

const MyApp = () => (
    <AppWrapper>
         <Layout sidebar={<Sidebar />}/>
    </AppWrapper>
   
)

export default MyApp
