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
        throw new Error('Property not found in schema')
    }
    return (
        <span>
            <ModelValueRenderer value={value} schemaProperty={schemaProperty} />
        </span>
    )
}
