import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import {
    Schema,
    SchemaFieldProperty,
    getIn,
    stringToPathArray,
} from '../../../lib'
import { ModelValueRenderer } from './ModelValueRenderer'

type ModelValueProps = {
    schema: Schema
    path: string
    model: unknown
    // override renderer
    component?: React.ComponentType<{
        value: unknown
        schemaProperty: SchemaFieldProperty
    }>
}

const ModelValueError = () => {
    return <span>Error</span>
}

const getSchemaProperty = (
    schema: Schema,
    path: string
): SchemaFieldProperty | undefined => {
    const pathParts = stringToPathArray(path).map((part) => {
        if (part === 'id') {
            return 'uid' // fieldName for 'id' is "uid" in schema.properties
        }
        return part
    })
    const rootPath = pathParts[0]

    const schemaProperty = schema.properties[rootPath]
    return schemaProperty
}

export const ModelValue = ({
    component,
    schema,
    path,
    model,
}: ModelValueProps) => {
    const schemaProperty = getSchemaProperty(schema, path)

    const value = getIn(model, path)

    if (!schemaProperty || value == undefined) {
        console.warn(
            `Property ${path} not found in schema, value not rendered: ${value}`
        )
        return null
    }

    const Component = component || ModelValueRenderer
    return (
        <ErrorBoundary FallbackComponent={ModelValueError}>
            <Component value={value} schemaProperty={schemaProperty} />
        </ErrorBoundary>
    )
}
