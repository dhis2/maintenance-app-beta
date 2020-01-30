import './App.css'

import { Provider } from 'react-redux'
import { useDataEngine } from '@dhis2/app-runtime'
import { CssVariables } from '@dhis2/ui-core'
import React, { useState } from 'react'

import { Router } from './Router'
import { configureStore } from './redux'
import styles from './App.module.css'

const App = () => {
    const engine = useDataEngine()
    const [store] = useState(configureStore(engine))

    return (
        <Provider store={store}>
            <CssVariables colors />
            <div className={styles.wrapper}>
                <Router />
            </div>
        </Provider>
    )
}

export default App
