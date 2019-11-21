import { Tab } from '@dhis2/ui-core'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router'
import React, { useCallback } from 'react'
import propTypes from '@dhis2/prop-types'

import {
    getSchemasData,
    getSystemSettingsData,
    getUserAuthoritiesData,
} from '../../redux'
import { hasUserAuthorityForGroup } from '../../utils'

const useOnClick = (disabled, goToPath, to) =>
    useCallback(
        e => {
            disabled ? e.preventDefault() : goToPath(to)
        },
        [disabled, to, goToPath]
    )

const NavigationLinkComponent = ({
    id,
    to,
    icon,
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
    const hasAuthority = hasUserAuthorityForGroup({
        noAuth,
        group,
        schemas,
        userAuthorities,
        systemSettings,
    })

    if (!hasAuthority) return null

    return (
        <Tab selected={id === match.params.group} onClick={onClick}>
            {label || icon}
        </Tab>
    )
}

const NavigationLink = withRouter(NavigationLinkComponent)

export { NavigationLink }
