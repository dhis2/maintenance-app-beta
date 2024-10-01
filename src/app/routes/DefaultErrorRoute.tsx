import { NoticeBox } from '@dhis2/ui'
import React from 'react'
import { useRouteError, isRouteErrorResponse } from 'react-router-dom'
import { SidebarLayout } from '../layout'
import { NotFound } from './NotFoundRoute'
import { isNotFoundError } from './utils'

export const DefaultErrorRoute = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = useRouteError()
    const isRouteError = isRouteErrorResponse(error)

    let title = 'An error occurred'
    let message = error?.message ?? 'An unknown error occurred.'

    if (isRouteError) {
        title = error.statusText
        message = error?.data?.message
    }

    return (
        <SidebarLayout>
            {isNotFoundError(error) ? (
                <NotFound />
            ) : (
                <NoticeBox warning={true} title={title}>
                    {message}
                </NoticeBox>
            )}
        </SidebarLayout>
    )
}
