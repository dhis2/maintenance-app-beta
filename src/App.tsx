import React from 'react'
import { AppWrapper, ConfiguredRouter } from './app/'

// @TODO: Find a solution for these!
const consoleWarnOrig = console.warn
console.warn = (...args) => {
    const msg = args[0]

    if (
        !msg.startsWith('The query should be static') &&
        !msg.startsWith('Data queries with paging=false are deprecated') &&
        !msg.startsWith('StyleSheet: illegal rule:')
    ) {
        consoleWarnOrig(...args)
    }
}

const MyApp = () => (
    <AppWrapper>
        <ConfiguredRouter />
    </AppWrapper>
)

export default MyApp
