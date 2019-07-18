import { nth, pipe, replace, split } from 'lodash/fp'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { Tab } from '@dhis2/ui-core'
import React, { useCallback } from 'react'

const replacePossibleLeadingSlash = replace(/^\//, '')

const getSectionFromPathSegments = pipe(
    split('/'),
    nth(1)
)

const extractSectionFromPath = pipe(
    replacePossibleLeadingSlash,
    getSectionFromPathSegments
)

const useOnClick = (disabled, push, to) =>
    useCallback(
        e => {
            disabled ? e.preventDefault() : push(to)
        },
        [disabled, to, push]
    )

const isNavLinkActive = (path, currentPath) => {
    if (path === currentPath) return true

    const section = extractSectionFromPath(currentPath)

    return path.match(section)
}

const NavigationLinkComponent = ({ pathname, to, disabled, label, push }) => {
    const onClick = useOnClick(disabled, push, to)

    return (
        <Tab selected={isNavLinkActive(to, pathname)} onClick={onClick}>
            {label}
        </Tab>
    )
}

const mapStateToProps = ({ router }) => ({ pathname: router.location.pathname })

const mapDispatchToProps = dispatch => ({ push: path => dispatch(push(path)) })

const NavigationLink = connect(
    mapStateToProps,
    mapDispatchToProps
)(NavigationLinkComponent)

export { NavigationLink }
