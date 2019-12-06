import { Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import React from 'react'

import { NoAuthority } from '../../views'
import {
    getSchemasData,
    getUserAuthoritiesData,
    getSystemSettingsData,
} from '../../redux'
import { hasUserAuthorityForSection } from '../../utils'
import { sectionPropType } from '../ContentWrappers/Sidebar/sectionPropType'

export const ProtectedRoute = ({ section, ...props }) => {
    const schemas = useSelector(getSchemasData)
    const userAuthorities = useSelector(getUserAuthoritiesData)
    const systemSettings = useSelector(getSystemSettingsData)

    const userHasAuthorityForSection = hasUserAuthorityForSection({
        userAuthorities,
        systemSettings,
        schemas,
        section,
    })

    if (!userHasAuthorityForSection) {
        return <Route {...props} component={NoAuthority} />
    }

    return <Route {...props} />
}

ProtectedRoute.propTypes = {
    ...Route.propTypes,
    section: sectionPropType.isRequired,
}
