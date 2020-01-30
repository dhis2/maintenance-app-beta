import { useHistory, useRouteMatch } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { Tab } from '@dhis2/ui-core'
import React, { useCallback } from 'react'
import cx from 'classnames'
import propTypes from '@dhis2/prop-types'

import { createTestNames } from '../../utils/dataTest/createTestNames'
import {
    getSchemasData,
    getSystemSettingsData,
    getUserAuthoritiesData,
} from '../../redux'
import { hasUserAuthorityForGroup } from '../../utils'
import styles from './NavigationLink.module.css'

const useOnClick = (disabled, goToPath, to) =>
    useCallback(
        (_, e) => {
            disabled ? e.preventDefault() : goToPath(to)
        },
        [disabled, to, goToPath]
    )

export const NavigationLink = ({
    id,
    to,
    icon,
    label,
    group,
    noAuth,
    disabled,
    dataTest,
}) => {
    const match = useRouteMatch()
    const history = useHistory()
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
        <Tab
            selected={id === match.params.group}
            onClick={onClick}
            className={cx(
                styles.link,
                createTestNames('navigation-link'),
                dataTest
            )}
        >
            {label || icon}
        </Tab>
    )
}

NavigationLink.propTypes = {
    id: propTypes.string.isRequired,
    to: propTypes.string.isRequired,
    dataTest: propTypes.string,
    disabled: propTypes.bool,
    group: propTypes.object,
    icon: propTypes.requiredIf(props => !props.label, propTypes.element),
    label: propTypes.requiredIf(props => !props.icon, propTypes.string),
    noAuth: propTypes.bool,
}
