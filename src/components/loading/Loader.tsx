import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import React from 'react'
import { QueryResponse } from '../../types'
import { LoadingSpinner } from './LoadingSpinner'

interface LoaderProps {
    children: React.ReactNode
    queryResponse: QueryResponse
    label?: string
}
export const Loader = ({ children, queryResponse, label }: LoaderProps) => {
    if (queryResponse.loading) {
        return <LoadingSpinner />
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
            <NoticeBox
                dataTest="loader-notice-box"
                title={i18n.t('Failed to load')}
            >
                {finalMessage}
            </NoticeBox>
        )
    }
    return <>{children}</>
}
