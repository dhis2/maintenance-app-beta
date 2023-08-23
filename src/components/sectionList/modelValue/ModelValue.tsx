import React from 'react'
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

    return <ModelValueRenderer value={value} schemaProperty={schemaProperty} />
}
