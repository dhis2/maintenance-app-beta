import React, { Fragment } from 'react'
import { Navigation } from '../components/Navigation'

/**
 * This needs to be done due to a limitation of `withRoute`
 * by the react-router lib,
 * see https://github.com/ReactTraining/react-router/issues/5947
 * for more information
 */
export const createPageComponent = Component => {
    return function Page(props) {
        return (
            <Fragment>
                <Navigation />
                <Component {...props} />
            </Fragment>
        )
    }
}
