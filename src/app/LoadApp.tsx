import { useDataQuery } from '@dhis2/app-runtime'
import React, { PropsWithChildren } from 'react'
import { Loader } from '../components/loading/Loader'

const query = {
    schemas: {
        resource: 'schemas',
        fields: 'authorities, displayName, name, plural, singular, translatable, properties',
    },
}

export const LoadApp = ({ children }: PropsWithChildren) => {
    const queryResponse = useDataQuery(query)
    return (
        <Loader queryResponse={queryResponse} label="schemas">
            {children}
        </Loader>
    )
}
