import { Route } from 'react-router-dom'
import { useDataQuery } from '@dhis2/app-runtime'
import React from 'react'
import propTypes from 'prop-types'

import { Error } from '../../pages/Error'
import { Loading } from '../../pages/Loading'
import { NoAuthority } from '../../pages/NoAuthority'
import { hasUserAuthorityForSection } from '../../utils/authority/hasUserAuthorityForSection'
import { queries } from '../../constants/queries'

const determineComponent = ({
    loading,
    error,
    data,
    permissions,
    component,
}) => {
    if (loading) return Loading

    if (error) return () => <Error error={error} />

    if (
        hasUserAuthorityForSection(
            data.authorities,
            data.systemSettings,
            permissions
        )
    ) {
        return component
    }

    return NoAuthority
}

export const ProtectedRoute = props => {
    const { loading, error, data } = useDataQuery({
        authorities: queries.authorities,
        systemSettings: queries.systemSettings,
    })

    return (
        <Route
            {...props}
            component={determineComponent({
                ...props,
                loading,
                error,
                data,
            })}
        />
    )
}

ProtectedRoute.propTypes = {
    ...Route.propTypes,
    permissions: propTypes.arrayOf(propTypes.string),
}
