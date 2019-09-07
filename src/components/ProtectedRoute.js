import { Route } from 'react-router-dom'
import { useDataQuery } from '@dhis2/app-runtime'
import React from 'react'
import propTypes from 'prop-types'

import { Error } from '../pages/Error'
import { Loading } from '../pages/Loading'
import { NoAuthority } from '../pages/NoAuthority'
import { hasUserAuthorityForSection } from '../utils/authority/hasUserAuthorityForSection'
import { queries } from '../constants/queries'

const defaultQuery = {
    authorities: queries.authorities,
    systemSettings: queries.systemSettings,
}

export const ProtectedRoute = ({ permissions, schemaName, ...props }) => {
    const query = schemaName
        ? {
              ...defaultQuery,
              schema: { resource: `schemas/${schemaName}.json` },
          }
        : defaultQuery

    const { loading, error, data = {} } = useDataQuery(query)

    if (loading) {
        return <Route {...props} component={Loading} />
    }

    if (error) {
        return <Route {...props} component={Error} />
    }

    const userHasAuthorityForSection = hasUserAuthorityForSection({
        permissions,
        authorities: data.authorities || {},
        systemSettings: data.systemSettings || {},
        schema: data.schema || {},
    })

    if (userHasAuthorityForSection) {
        return <Route {...props} component={props.component} />
    }

    return <Route {...props} component={NoAuthority} />
}

ProtectedRoute.propTypes = {
    ...Route.propTypes,
    permissions: propTypes.arrayOf(propTypes.string),
    schemaName: propTypes.string,
}

ProtectedRoute.defaultProps = {
    schemaName: '',
}
