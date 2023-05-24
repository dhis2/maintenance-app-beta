import { useDataQuery } from '@dhis2/app-runtime'
import React from 'react'
import { Loader } from '../components/loading/Loader'

const query = {
    schemas: {
        resource: 'schemas',
        fields: 'authorities, displayName, name, plural, singular, translatable, properties',
    },
}

interface LoadAppProps {
    children: React.ReactNode
}

export const LoadApp: React.FC<LoadAppProps> = ({ children }) => {
    const queryResponse = useDataQuery(query)
    return (
        <Loader queryResponse={queryResponse} label="schemas">
            {children}
        </Loader>
    )
}
