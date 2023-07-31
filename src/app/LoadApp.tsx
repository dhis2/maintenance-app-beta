import i18n from '@dhis2/d2-i18n'
import React, { PropsWithChildren } from 'react'
import { Loader } from '../components'
import { useLoadApp } from '../lib'

export const LoadApp = ({ children }: PropsWithChildren) => {
    const queryResponse = useLoadApp()
    return (
        <Loader queryResponse={queryResponse} label={i18n.t('schemas')}>
            {children}
        </Loader>
    )
}
