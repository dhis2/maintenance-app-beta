import React, { ReactNode } from 'react'
import { Loader } from '../components/loading/Loader'
import { useLoadSchemas } from '../schemas/'

export const LoadApp = ({ children }: { children: ReactNode }) => {
    const queryResponse = useLoadSchemas()

    return (
        <Loader queryResponse={queryResponse} label="schemas">
            {children}
        </Loader>
    )
}
