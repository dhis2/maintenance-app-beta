import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import React, { useCallback } from 'react'

import cx from 'classnames'

import { mainSectionOrder } from '../constants/sectionOrder'
import styles from './Navigation.module.css'

const Navigation = ({ disabled }) => {
    const onClick = useCallback(
        e => {
            disabled && e.preventDefault()
        },
        [disabled]
    )

    return (
        <nav
            className={cx({
                [styles.disabled]: disabled,
            })}
        >
            <Link onClick={onClick} to="/">
                All
            </Link>

            {mainSectionOrder.map(({ name, path }) => (
                <Link key={path} onClick={onClick} to={path}>
                    {' | '}
                    {name}
                </Link>
            ))}
        </nav>
    )
}

const ConnectedNavigation = connect(({ navigation }) => ({
    disabled: navigation.disabled,
}))(Navigation)

export { ConnectedNavigation as Navigation }
