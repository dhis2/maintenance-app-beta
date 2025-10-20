import React from 'react'
import { SchemaFieldProperty, SchemaFieldPropertyType } from '../../../lib'
import { BooleanValue } from './BooleanValue'
import { ConstantValue } from './ConstantValue'
import { DateValue } from './DateValue'
import { ImageValue } from './ImageValue'
import { ModelReference, isModelReference } from './ModelReference'
import { PublicAccessValue } from './PublicAccess'
import { TextValue } from './TextValue'

export type ValueDetails = {
    schemaProperty: SchemaFieldProperty
    value: unknown
    path: string
}

export const ModelValueRenderer = ({
    path,
    value,
    schemaProperty,
}: ValueDetails) => {
    const hasToStringMethod = (
        value: unknown
    ): value is { toString: () => string } =>
        typeof (value as any).toString === 'function'

    if (path === 'sharing.public' && typeof value === 'string') {
        return <PublicAccessValue value={value} />
    }

    if (schemaProperty.propertyType === 'CONSTANT') {
        return <ConstantValue value={value as string} />
    }

    if (schemaProperty.propertyType === 'DATE') {
        return <DateValue value={value as string} />
    }

    if (
        schemaProperty.propertyType === SchemaFieldPropertyType.REFERENCE &&
        isModelReference(value)
    ) {
        return <ModelReference value={value} />
    }

    if (typeof value === 'boolean') {
        return <BooleanValue value={value} />
    }

    if (typeof value === 'string' && value.includes('/api/icons/')) {
        return <ImageValue value={value} />
    }

    if (value !== null && value !== undefined && hasToStringMethod(value)) {
        return <TextValue value={value.toString()} />
    }

    return null
}
