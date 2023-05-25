import React, { PropsWithChildren } from 'react'
import { Loader } from '../components'
import { useLoadApp } from '../lib'

export const LoadApp = ({ children }: PropsWithChildren) => {
    const queryResponse = useLoadApp()
    return (
        <Loader queryResponse={queryResponse} label="schemas">
            {children}
        </Loader>
    )
}
