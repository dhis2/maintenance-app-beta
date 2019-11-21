import { identity } from 'lodash/fp'
import { useSelector } from 'react-redux'
import React from 'react'
import propTypes from '@dhis2/prop-types'

import { NavigationLink } from './NavigationLink'
import { Transform } from '../icons/Transform'
import {
    getSchemasData,
    getSystemSettingsData,
    getUserAuthoritiesData,
} from '../../redux'
import { hasUserAuthorityForSection } from '../../utils'

const getAuthorityByType = type => authorities => {
    const authByType = authorities.find(authority => authority.type === type)

    if (!authByType) {
        return null
    }

    return authByType.authorities
}

const getPublicCreateAuthorities = getAuthorityByType('CREATE_PUBLIC')
const getPrivateCreateAuthorities = getAuthorityByType('CREATE_PRIVATE')

/**
 * This component is not a regular group as it needs only a subset
 * of some schema's authorities
 */
export const GroupEditorLink = ({ disabled }) => {
    const schemas = useSelector(getSchemasData)
    const systemSettings = useSelector(getSystemSettingsData)
    const userAuthorities = useSelector(getUserAuthoritiesData)

    const dataElementsSchema = schemas.dataElements.authorities
    const dataElementsCreatePublic = getPublicCreateAuthorities(
        dataElementsSchema
    )
    const dataElementsCreatePrivate = getPrivateCreateAuthorities(
        dataElementsSchema
    )

    const indicatorGroupsSchema = schemas.indicatorGroups.authorities
    const indicatorGroupsCreatePublic = getPublicCreateAuthorities(
        indicatorGroupsSchema
    )
    const indicatorGroupsCreatePrivate = getPrivateCreateAuthorities(
        indicatorGroupsSchema
    )

    const permissions = [
        dataElementsCreatePublic,
        dataElementsCreatePrivate,
        indicatorGroupsCreatePublic,
        indicatorGroupsCreatePrivate,
    ].filter(identity)

    const userHasAuthorityForGroupEditor = hasUserAuthorityForSection({
        authorities: userAuthorities,
        systemSettings,
        permissions,
    })

    if (!userHasAuthorityForGroupEditor) {
        return null
    }

    return (
        <NavigationLink
            noAuth
            id="groupEditor"
            to="/group-editor"
            icon={<Transform />}
            disabled={disabled}
        />
    )
}

GroupEditorLink.propTypes = {
    disabled: propTypes.bool,
}
