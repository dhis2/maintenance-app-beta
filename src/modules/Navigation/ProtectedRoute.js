import { Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import React from 'react'
import propTypes from 'prop-types'

import { NoAuthority } from '../../views/NoAuthority'
import { getSchemasData } from '../../redux/schemas'
import { getSystemSettingsData } from '../../redux/systemSettings'
import { getUserAuthoritiesData } from '../../redux/userAuthority'
import { hasUserAuthorityForSection } from '../../utils/authority/hasUserAuthorityForSection'

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
