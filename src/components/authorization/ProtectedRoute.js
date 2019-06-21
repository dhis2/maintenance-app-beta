import { Route } from 'react-router-dom'
import { useDataQuery } from '@dhis2/app-runtime'
import React from 'react'
import propTypes from 'prop-types'

import { Error } from '../../pages/Error'
import { Loading } from '../../pages/Loading'
import { NoAuthority } from '../../pages/NoAuthority'
import { hasUserAuthorityForSection } from '../../utils/authority/hasUserAuthorityForSection'
import { queries } from '../../constants/queries'

export const ProtectedRoute = ({ permissions, component, ...rest }) => {
    const { loading, error, data } = useDataQuery({
        authorities: queries.authorities,
    })

    return (
        <Route
            {...rest}
            component={
                loading
                    ? Loading
                    : error
                    ? () => <Error error={error} />
                    : hasUserAuthorityForSection(data.authorities, permissions)
                    ? component
                    : NoAuthority
            }
        />
    )
}

ProtectedRoute.propTypes = {
    ...Route.propTypes,
    permissions: propTypes.arrayOf(propTypes.string),
}
