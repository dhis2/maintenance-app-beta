import { Tab } from '@dhis2/ui-core'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router'
import React, { useCallback } from 'react'

import { getSchemasData } from '../../redux/schemas'
import { getSystemSettingsData } from '../../redux/systemSettings'
import { getUserAuthoritiesData } from '../../redux/userAuthority'
import { hasUserAuthorityForGroup } from '../../utils/authority/hasUserAuthorityForGroup'

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
            {label}
        </Tab>
    )
}

const NavigationLink = withRouter(NavigationLinkComponent)

export { NavigationLink }
