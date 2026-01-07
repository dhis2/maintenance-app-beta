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
    sectionModel: Record<string, unknown>
}

const ModelValueError = () => {
    return <span>Error</span>
}

export const getSchemaProperty = (
    schema: Schema,
    path: string
): SchemaFieldProperty | undefined => {
    const pathParts = stringToPathArray(path).map((part) => {
        if (part === 'id') {
            return 'uid' // fieldName for 'id' is "uid" in schema.properties
        }
        if (part === 'programRuleVariableSourceType') {
            return 'sourceType' // fieldName for 'programRuleVariableSourceType' is "sourceType" in schema.properties
        }
        return part
    })
    const rootPath = pathParts[0]

    const schemaProperty = schema.properties[rootPath]
    return schemaProperty
}

export const ModelValue = ({ schema, path, sectionModel }: ModelValueProps) => {
    const schemaProperty = getSchemaProperty(schema, path)

    const value = getIn(sectionModel, path)

    if (!schemaProperty || value == undefined) {
        console.warn(`Property ${path} not found, value not rendered: ${value}`)
        return null
    }

    return (
        <ErrorBoundary FallbackComponent={ModelValueError}>
            <ModelValueRenderer
                path={path}
                value={value}
                propertyType={schemaProperty.propertyType}
            />
        </ErrorBoundary>
    )
}
