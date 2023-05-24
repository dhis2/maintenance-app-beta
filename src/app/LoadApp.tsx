import React, { ReactNode } from 'react'
import { Loader } from '../components/loading/Loader'
import { useLoadApp } from '../lib'

export const LoadApp = ({ children }: { children: ReactNode }) => {
    const queryResponse = useLoadApp()
    return (
        <Loader queryResponse={queryResponse} label="schemas">
            {children}
        </Loader>
    )
}
