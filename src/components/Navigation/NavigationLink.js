import { Tab } from '@dhis2/ui-core'
import { connect } from 'react-redux'
import { pipe, map, mapValues } from 'lodash/fp'
import { push } from 'connected-react-router'
import { useDataQuery } from '@dhis2/app-runtime'
import React, { useCallback } from 'react'

import { withRouter } from 'react-router'

import { queries } from '../../constants/queries'

const uncappedMapValues = mapValues.convert({ cap: false })

const useOnClick = (disabled, push, to) =>
    useCallback(
        e => {
            disabled ? e.preventDefault() : push(to)
        },
        [disabled, to, push]
    )

const NavigationLinkComponent = ({
    to,
    push,
    label,
    group,
    disabled,
    match,
}) => {
    const onClick = useOnClick(disabled, push, to)
    const systemSettingsQuery = {
        systemSettings: queries.systemSettings,
    }

    const schemasQuery = map(
        // lodash map will convert objects to arrays
        section => ({ resource: `schemas/${section.schemaName}.json` }),
        group.sections
    ).reduce(
        (schemas, resourceQuery, index) => ({
            ...schemas,
            [`schema${index}`]: resourceQuery,
        }),
        {}
    )

    const {
        loading: systemSettingsLoading,
        error: systemSettingsError,
        data: systemSettings,
    } = useDataQuery(systemSettingsQuery)

    const {
        loading: schemasLoading,
        error: schemasError,
        data: schemas,
    } = useDataQuery(schemasQuery)

    //if (systemSettingsLoading) return console.log('loading systemSettings', systemSettingsLoading) || null
    if (schemasLoading)
        return console.log('loading schemas', schemasLoading) || null
    //if (systemSettingsError) return console.log('error systemSettings', systemSettingsError) || null
    if (schemasError) return console.log('error schemas', schemasError) || null

    console.log('data', systemSettings, schemas)

    const activeGroup = match.params.group

    return (
        <Tab selected={group === activeGroup} onClick={onClick}>
            {label}
        </Tab>
    )
}

const mapDispatchToProps = dispatch => ({ push: path => dispatch(push(path)) })

const NavigationLink = pipe(
    withRouter,
    connect(
        undefined,
        mapDispatchToProps
    )
)(NavigationLinkComponent)

export { NavigationLink }
