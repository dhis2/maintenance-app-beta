import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { ScrollBar, TabBar, Tab } from '@dhis2/ui-core'
import React, { useCallback } from 'react'

import cx from 'classnames'

import { mainSectionOrder } from '../constants/sectionOrder'
import styles from './Navigation.module.css'

const useOnClick = (disabled, push, to) =>
    useCallback(
        e => {
            disabled ? e.preventDefault() : push(to)
        },
        [disabled, to, push]
    )

const isNavLinkActive = (path, currentPath) => {
    if (path === currentPath) return true

    const section = currentPath
        .replace(/^\//, '') // remove possible leading slash
        .split('/')[1] // field 1 contains the section, field 0 is the mode (edit / list)

    return path.match(section)
}

const NavigationLink = connect(
    state =>
        console.log(state.router) || {
            pathname: state.router.location.pathname,
        },
    dispatch => ({ push: path => dispatch(push(path)) })
)(({ pathname, to, disabled, label, push }) => {
    const onClick = useOnClick(disabled, push, to)

    return (
        <Tab selected={isNavLinkActive(to, pathname)} onClick={onClick}>
            {label}
        </Tab>
    )
})

const Navigation = ({ disabled }) => {
    return (
        <nav
            className={cx({
                [styles.disabled]: disabled,
            })}
        >
            <ScrollBar>
                <TabBar fixed>
                    <NavigationLink
                        to="/list/all"
                        disabled={disabled}
                        label={'All'}
                    />

                    {mainSectionOrder.map(({ name, path }) => (
                        <NavigationLink
                            key={path}
                            to={path}
                            label={name}
                            disabled={disabled}
                        />
                    ))}
                </TabBar>
            </ScrollBar>
        </nav>
    )
}

const ConnectedNavigation = connect(({ navigation }) => ({
    disabled: navigation.disabled,
}))(Navigation)

export { ConnectedNavigation as Navigation }
