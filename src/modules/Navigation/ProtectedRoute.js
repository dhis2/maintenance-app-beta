import { Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import React from 'react'
import propTypes from 'prop-types'

import {
    getSchemasData,
    getUserAuthoritiesData,
    getSystemSettingsData,
} from '../../redux'
import { hasUserAuthorityForSection } from '../../utils'
import { NoAuthority } from '../../views'

export const ProtectedRoute = ({ permissions, schemaName, ...props }) => {
    const schemas = useSelector(getSchemasData)
    const userAuthorities = useSelector(getUserAuthoritiesData)
    const systemSettings = useSelector(getSystemSettingsData)

    const userHasAuthorityForSection = hasUserAuthorityForSection({
        permissions,
        authorities: userAuthorities,
        systemSettings: systemSettings,
        schema: schemas[schemaName],
    })

    if (!userHasAuthorityForSection) {
        return <Route {...props} component={NoAuthority} />
    }

    return <Route {...props} />
}

ProtectedRoute.propTypes = {
    ...Route.propTypes,
    permissions: propTypes.arrayOf(propTypes.string),
    schemaName: propTypes.string,
}

ProtectedRoute.defaultProps = {
    schemaName: '',
}
