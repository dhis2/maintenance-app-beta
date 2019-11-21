import { MenuItem } from '@dhis2/ui-core'
import { useSelector } from 'react-redux'
import React from 'react'
import propTypes from '@dhis2/prop-types'

import { getAuthoritiesFromSchema, checkAuthorities } from '../../../utils'
import { getSchemasData, getUserAuthoritiesData } from '../../../redux'

export const SidebarMenuItem = ({ schemaName, permissions, ...props }) => {
    const hasStaticPermissions = !!permissions.length
    const userAuthorities = useSelector(getUserAuthoritiesData)
    const schemas = useSelector(getSchemasData)
    const schema = schemas[schemaName]

    const authorities = [
        ...permissions,
        ...(hasStaticPermissions ? [] : getAuthoritiesFromSchema(schema)),
    ]

    if (!checkAuthorities(authorities, userAuthorities)) return null

    return <MenuItem {...props} />
}

SidebarMenuItem.propTypes = {
    schemaName: propTypes.string,
    permissions: propTypes.arrayOf(propTypes.arrayOf(propTypes.string)),
}

SidebarMenuItem.defaultProps = {
    permissions: [],
}
