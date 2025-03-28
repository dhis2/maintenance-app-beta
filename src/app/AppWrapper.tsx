import { CssReset, CssVariables } from '@dhis2/ui'
import React from 'react'
import { LoadApp } from './LoadApp'

interface AppWrapperProps {
    children: React.ReactNode
}

export const AppWrapper = ({ children }: AppWrapperProps) => {
    return (
        <>
            <CssReset />
            <CssVariables theme spacers colors elevations />
            <LoadApp>{children}</LoadApp>
        </>
    )
}
