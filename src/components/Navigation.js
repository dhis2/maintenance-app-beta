import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import React, { useCallback } from 'react'
import cx from 'classnames'
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
            <Link onClick={onClick} to="/list/categorySection">
                Category
            </Link>
            <Link onClick={onClick} to="/list/dataElementSection">
                Data element
            </Link>
            <Link onClick={onClick} to="/list/dataSetSection">
                Data set
            </Link>
            <Link onClick={onClick} to="/list/indicatorSection">
                Indicator
            </Link>
            <Link onClick={onClick} to="/list/organisationUnitSection">
                Organsiation unit
            </Link>
            <Link onClick={onClick} to="/list/programSection">
                Program
            </Link>
            <Link onClick={onClick} to="/list/validationSection">
                Validation
            </Link>
            <Link onClick={onClick} to="/list/otherSection">
                Other
            </Link>
        </nav>
    )
}

const ConnectedNavigation = connect(({ navigation }) => ({
    disabled: navigation.disabled,
}))(Navigation)

export { ConnectedNavigation as Navigation }
