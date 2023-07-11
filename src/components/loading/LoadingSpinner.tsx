import { CircularLoader } from '@dhis2/ui'
import cx from 'classnames'
import React from 'react'
import styles from './Loader.module.css'

export const LoadingSpinner = ({
    centered = true,
    ...rest
}: {
    centered?: boolean
}) => (
    <CircularLoader
        {...rest}
        className={cx(styles.loadingSpinner, { [styles.centered]: centered })}
    />
)
