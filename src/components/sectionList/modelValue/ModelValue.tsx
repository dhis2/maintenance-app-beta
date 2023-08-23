import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Schema, SchemaFieldProperty } from '../../../lib'
import { ModelValueRenderer } from './ModelValueRenderer'

export type ValueDetails = {
    schemaProperty: SchemaFieldProperty
    value: unknown
}

type ModelValueProps = {
    schema: Schema
    modelPropertyName: string
    value: unknown
}

const ModelValueError = () => {
    return <span>Error</span>
}

export const ModelValue = ({
    schema,
    modelPropertyName,
    value,
}: ModelValueProps) => {
    const schemaProperty = schema.properties[modelPropertyName]

    if (!schemaProperty) {
        console.warn(
            `Property ${modelPropertyName} not found in schema, value not rendered: ${value}`
        )
        return null
    }

    return (
        <ErrorBoundary FallbackComponent={ModelValueError}>
            <ModelValueRenderer value={value} schemaProperty={schemaProperty} />
        </ErrorBoundary>
    )
}
