import { MenuItem } from '@dhis2/ui-core'
import { useDataQuery } from '@dhis2/app-runtime'
import React from 'react'
import propTypes from 'prop-types'

import { getAuthoritiesFromSchema } from '../../../utils/authority/getAuthoritiesFromSchema'
import { hasAuthority } from '../../../utils/authority/hasAuthority'
import { queries } from '../../../config/queries'

export const SidebarMenuItem = ({ schemaName, permissions, ...props }) => {
    const hasStaticPermissions = !!permissions.length
    const { loading, error, data } = useDataQuery({
        userAuthorities: queries.authorities,
        ...(hasStaticPermissions
            ? {}
            : {
                  schema: {
                      resource: `schemas/${schemaName}.json?fields=authorities`,
                  },
              }),
    })

    if (loading) return null
    if (error) {
        console.error(error)
        return null
    }

    const authorities = [
        ...permissions,
        ...(hasStaticPermissions ? [] : getAuthoritiesFromSchema(data.schema)),
    ]

    if (!hasAuthority(authorities, data.userAuthorities)) return null

    return <MenuItem {...props} />
}

SidebarMenuItem.propTypes = {
    schemaName: propTypes.string,
    permissions: propTypes.arrayOf(propTypes.arrayOf(propTypes.string)),
}

SidebarMenuItem.defaultProps = {
    permissions: [],
}
