import { Tab } from '@dhis2/ui-core'
import { concat, flatten, map, pipe, reduce } from 'lodash/fp'
import { useSelector } from 'react-redux'
import React, { useCallback } from 'react'

import { withRouter } from 'react-router'

import { getAuthoritiesFromSchema } from '../../utils/authority/getAuthoritiesFromSchema'
import { getSchemasData } from '../../redux/schemas'
import { getSystemSettingsData } from '../../redux/systemSettings'
import { getUserAuthoritiesData } from '../../redux/userAuthority'
import { hasAuthority } from '../../utils/authority/hasAuthority'

const HAS_NO_AUTHORITY = 0
const HAS_AUTHORITY = 1

const useOnClick = (disabled, goToPath, to) =>
    useCallback(
        e => {
            disabled ? e.preventDefault() : goToPath(to)
        },
        [disabled, to, goToPath]
    )

/**
 * lodash map will convert objects to arrays
 * @param {Sections} sections
 * @returns Permissions
 */
const extractStaticPermissions = reduce(
    (staticPermissions, curSection) =>
        curSection.permissions
            ? [...staticPermissions, ...curSection.permissions]
            : staticPermissions,
    []
)

/**
 * @param {string[][]}
 * @returns {Function}
 */
const schemasToAuthorities = staticPermissions =>
    pipe(
        map(getAuthoritiesFromSchema),
        flatten,
        concat(staticPermissions)
    )

/**
 * @param {bool} noAuth
 * @param {Group} group
 * @returns {AuthorityConfig}
 */
const useHasAuthority = ({
    noAuth,
    group,
    schemas,
    systemSettings,
    userAuthorities,
}) => {
    if (noAuth) return HAS_AUTHORITY

    if (systemSettings.keyRequireAddToView) {
        const staticPermissions = extractStaticPermissions(group.sections)
        const requiredAuthorities = schemasToAuthorities(staticPermissions)(
            schemas
        )

        if (!hasAuthority(requiredAuthorities, userAuthorities)) {
            return HAS_NO_AUTHORITY
        }
    }

    return HAS_AUTHORITY
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
    const hasAuthority = useHasAuthority({
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
