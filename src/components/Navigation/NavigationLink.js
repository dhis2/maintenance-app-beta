import { Tab } from '@dhis2/ui-core'
import { connect } from 'react-redux'
import { concat, identity, map, pipe, reduce } from 'lodash/fp'
import { push } from 'connected-react-router'
import { useDataQuery } from '@dhis2/app-runtime'
import React, { useCallback } from 'react'
import i18n from '@dhis2/d2-i18n'

import { withRouter } from 'react-router'

import { queries } from '../../constants/queries'

const AUTHORITY_NOT_DETERMINED = -1
const HAS_NO_AUTHORITY = 0
const HAS_AUTHORITY = 1

const useOnClick = (disabled, push, to) =>
    useCallback(
        e => {
            disabled ? e.preventDefault() : push(to)
        },
        [disabled, to, push]
    )

const extractStaticPermissions = reduce(
    (staticPermissions, curSection) =>
        curSection.permissions
            ? [...staticPermissions, ...curSection.permissions]
            : staticPermissions,
    []
)

/**
 * lodash map will convert objects to arrays
 */
const createSchemasQuery = sections =>
    map(
        section =>
            section.schemaName
                ? {
                      resource: `schemas/${section.schemaName}.json?fields=authorities`,
                  }
                : undefined,
        sections
    )
        .filter(identity)
        .reduce(
            (schemas, resourceQuery, index) => ({
                ...schemas,
                [`schema${index}`]: resourceQuery,
            }),
            {}
        )

const schemasToAuthorities = staticPermissions =>
    pipe(
        reduce(
            (authAcc, curSchema) => [...authAcc, ...curSchema.authorities],
            []
        ),
        reduce((auths, curAuth) => [...auths, curAuth.authorities], []),
        concat(staticPermissions)
    )

const hasAuthorityForGroup = (requiredAuthorities, userAuthorities) =>
    requiredAuthorities.reduce(
        (authorized, requiredAuthority) =>
            authorized ||
            requiredAuthority.some(
                reqAuth => userAuthorities.indexOf(reqAuth) !== -1
            ),
        false
    )

const useHasAuthority = (noAuth, group) => {
    const authoritiesQuery = noAuth
        ? {}
        : { userAuthorities: queries.authorities }
    const systemSettingsQuery = noAuth
        ? {}
        : { systemSettings: queries.systemSettings }
    const schemasQuery = noAuth ? {} : createSchemasQuery(group.sections)

    const {
        loading: authoritiesLoading,
        error: authoritiesError,
        data: { userAuthorities } = {},
    } = useDataQuery(authoritiesQuery)

    const {
        loading: systemSettingsLoading,
        error: systemSettingsError,
        data: { systemSettings } = {},
    } = useDataQuery(systemSettingsQuery)

    const {
        loading: schemasLoading,
        error: schemasError,
        data: schemas,
    } = useDataQuery(schemasQuery)

    if (!noAuth) {
        if (
            authoritiesLoading ||
            systemSettingsLoading ||
            systemSettingsLoading
        ) {
            return {
                loading: true,
                error: '',
                hasAuthority: AUTHORITY_NOT_DETERMINED,
            }
        }

        if (authoritiesError) {
            return {
                loading: false,
                error: authoritiesError,
                hasAuthority: AUTHORITY_NOT_DETERMINED,
            }
        }

        if (systemSettingsError) {
            return {
                loading: false,
                error: systemSettingsError,
                hasAuthority: AUTHORITY_NOT_DETERMINED,
            }
        }

        if (schemasError) {
            return {
                loading: false,
                error: schemasError,
                hasAuthority: AUTHORITY_NOT_DETERMINED,
            }
        }
    }

    if (!noAuth && systemSettings.keyRequireAddToView) {
        const staticPermissions = noAuth
            ? []
            : extractStaticPermissions(group.sections)
        const requiredAuthorities = noAuth
            ? []
            : schemasToAuthorities(staticPermissions)(schemas)
        const hasAuthority =
            noAuth || hasAuthorityForGroup(requiredAuthorities, userAuthorities)

        return {
            loading: false,
            error: '',
            hasAuthority: !hasAuthority ? HAS_NO_AUTHORITY : HAS_AUTHORITY,
        }
    }

    return { loading: false, error: '', hasAuthority: HAS_AUTHORITY }
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

    if (error) {
        console.error(error)
        return null
    }

    if (!hasAuthority) {
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
