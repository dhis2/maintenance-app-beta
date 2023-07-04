import i18n from '@dhis2/d2-i18n'
import { CircularLoader, NoticeBox } from '@dhis2/ui'
import React from 'react'
import { QueryResponse } from '../../types'
import styles from './Loader.module.css'

interface LoaderProps {
    children: React.ReactNode
    queryResponse: QueryResponse
    label?: string
}
export const Loader = ({ children, queryResponse, label }: LoaderProps) => {
    if (queryResponse.loading) {
        return <CircularLoader className={styles.loadingSpinner} />
    }
    if (queryResponse.error) {
        const message = queryResponse.error?.message
        const errorMessage = message ? `: ${message}` : ''
        const labelMessage = label
            ? i18n.t('Failed to load {{label}}', {
                  label,
              })
            : i18n.t('Failed to load')

        const finalMessage = `${labelMessage}${errorMessage}.`
        return (
            <NoticeBox title={i18n.t('Failed to load')}>
                {finalMessage}
            </NoticeBox>
        )
    }
    return <>{children}</>
}
