import { Tab } from '@dhis2/ui-core'
import { identity } from 'lodash/fp'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router'
import React, { useCallback } from 'react'

import { getAuthoritiesFromSchema } from '../../utils/authority/getAuthoritiesFromSchema'
import { getSchemasData } from '../../redux/schemas'
import { getSystemSettingsData } from '../../redux/systemSettings'
import { getUserAuthoritiesData } from '../../redux/userAuthority'
import { checkAuthorities } from '../../utils/authority/checkAuthorities'

const useOnClick = (disabled, goToPath, to) =>
    useCallback(
        e => {
            disabled ? e.preventDefault() : goToPath(to)
        },
        [disabled, to, goToPath]
    )

/**
 * @param {bool} noAuth
 * @param {Group} group
 * @returns {AuthorityConfig}
 */
const checkUserHasAuthorities = ({
    noAuth,
    group,
    schemas,
    systemSettings,
    userAuthorities,
}) => {
    if (noAuth || !systemSettings.keyRequireAddToView) return true

    const groupAuthorities = Object.entries(group.sections)
        .map(([key, { permissions, schemaName }]) => {
            // Static permissions in config files
            if (permissions) return permissions

            // If there are no static permissions extract them from the schemas
            if (schemas[schemaName])
                return getAuthoritiesFromSchema(schemas[schemaName])

            // just in case there's no schema defined, should never happen theoretically
            return null
        })
        .filter(identity)

    // User has authority for group if he has authority for any section inside
    return groupAuthorities.some(sectionAuthorities =>
        checkAuthorities(sectionAuthorities, userAuthorities)
    )
}

const NavigationLinkComponent = ({
    id,
    to,
    goToPath,
    label,
    group,
    match,
    noAuth,
    disabled,
    history,
}) => {
    const onClick = useOnClick(disabled, path => history.push(path), to)
    const schemas = useSelector(getSchemasData)
    const userAuthorities = useSelector(getUserAuthoritiesData)
    const systemSettings = useSelector(getSystemSettingsData)
    const hasAuthority = checkUserHasAuthorities({
        noAuth,
        group,
        schemas,
        userAuthorities,
        systemSettings,
    })

    if (!hasAuthority) return null

    return (
        <Tab selected={id === match.params.group} onClick={onClick}>
            {label}
        </Tab>
    )
}

const NavigationLink = withRouter(NavigationLinkComponent)

export { NavigationLink }
