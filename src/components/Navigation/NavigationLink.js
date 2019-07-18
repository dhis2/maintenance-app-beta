import { pipe } from 'lodash/fp'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { withRouter } from 'react-router'
import { Tab } from '@dhis2/ui-core'
import React, { useCallback } from 'react'

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
    section,
    disabled,
    match,
}) => {
    const onClick = useOnClick(disabled, push, to)
    const activeSection = match.params.section

    return (
        <Tab selected={section === activeSection} onClick={onClick}>
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
