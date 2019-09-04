import { Tab } from '@dhis2/ui-core'
import { concat, filter, flatten, identity, map, pipe, reduce } from 'lodash/fp'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { useDataQuery } from '@dhis2/app-runtime'
import { withRouter } from 'react-router'
import React, { useCallback } from 'react'
import i18n from '@dhis2/d2-i18n'

import { getAuthoritiesFromSchema } from '../../utils/authority/getAuthoritiesFromSchema'
import { hasAuthority } from '../../utils/authority/hasAuthority'
import { queries } from '../../constants/queries'

const AUTHORITY_NOT_DETERMINED = -1
const HAS_NO_AUTHORITY = 0
const HAS_AUTHORITY = 1

const uncappedReduce = reduce.convert({ cap: false })

const useOnClick = (disabled, push, to) =>
    useCallback(
        e => {
            disabled ? e.preventDefault() : push(to)
        },
        [disabled, to, push]
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
 * @param {string} schemaName
 * @returns {string}
 */
const createSchemaResourceUrl = schemaName =>
    `schemas/${schemaName}.json?fields=authorities`

/**
 * lodash map will convert objects to arrays
 * @param {Sections} sections
 * @returns Object
 */
const createSchemasQuery = pipe(
    map(section =>
        section.schemaName
            ? { resource: createSchemaResourceUrl(section.schemaName) }
            : undefined
    ),
    filter(identity),
    uncappedReduce(
        (schemas, resourceQuery, index) => ({
            ...schemas,
            [`schema${index}`]: resourceQuery,
        }),
        {}
    )
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
 * @typedef {Object} AuthorityConfig
 * @property {bool} loading
 * @property {string} error
 * @property {number} hasAuthority
 */

/**
 * @returns {AuthorityConfig}
 */
const getAuthorityNotDetermined = () => ({
    loading: true,
    error: '',
    hasAuthority: AUTHORITY_NOT_DETERMINED,
})

/**
 * @param {string} error
 * @returns {AuthorityConfig}
 */
const getHasNoAuthorityConfig = (error = '') => ({
    loading: false,
    error,
    hasAuthority: HAS_NO_AUTHORITY,
})

/**
 * @returns {AuthorityConfig}
 */
const getHasAuthorityConfig = () => ({
    loading: false,
    error: '',
    hasAuthority: HAS_AUTHORITY,
})

const defaultQuery = {
    userAuthorities: queries.authorities,
    systemSettings: queries.systemSettings,
}

/**
 * @param {bool} noAuth
 * @param {Group} group
 * @returns {AuthorityConfig}
 */
const useHasAuthority = (noAuth, group) => {
    const query = {
        ...(noAuth ? {} : defaultQuery),
        ...(noAuth ? {} : createSchemasQuery(group.sections)),
    }

    const {
        loading,
        error,
        data: { userAuthorities, systemSettings, ...schemas } = {},
    } = useDataQuery(query)

    if (noAuth) return getHasAuthorityConfig()
    if (loading) return getAuthorityNotDetermined()
    if (error) return getHasNoAuthorityConfig(error)

    if (systemSettings.keyRequireAddToView) {
        const staticPermissions = extractStaticPermissions(group.sections)
        const requiredAuthorities = schemasToAuthorities(staticPermissions)(
            schemas
        )

        if (!hasAuthority(requiredAuthorities, userAuthorities)) {
            return getHasNoAuthorityConfig()
        }
    }

    return getHasAuthorityConfig()
}

const NavigationLinkComponent = ({
    id,
    to,
    push,
    label,
    group,
    match,
    noAuth,
    disabled,
}) => {
    const onClick = useOnClick(disabled, push, to)
    const { loading, error, hasAuthority } = useHasAuthority(noAuth, group)

    if (loading) {
        return <Tab>{i18n.t('Checking %s', group.name)}</Tab>
    }

    if (error || !hasAuthority) {
        return null
    }

    return (
        <Tab selected={id === match.params.group} onClick={onClick}>
            {label}
        </Tab>
    )
}

const NavigationLink = pipe(
    withRouter,
    connect(
        undefined,
        dispatch => ({ push: path => dispatch(push(path)) })
    )
)(NavigationLinkComponent)

export { NavigationLink }
