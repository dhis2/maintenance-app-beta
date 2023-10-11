import React from 'react'
import { SchemaFieldProperty } from '../../../lib'
import { BooleanValue } from './BooleanValue'
import { ConstantValue } from './ConstantValue'
import { DateValue } from './DateValue'
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
    if (path === 'sharing.public' && typeof value === 'string') {
        return <PublicAccessValue value={value} />
    }

    if (schemaProperty.propertyType === 'CONSTANT') {
        return <ConstantValue value={value as string} />
    }

    if (schemaProperty.propertyType === 'DATE') {
        return <DateValue value={value as string} />
    }

    if (typeof value === 'boolean') {
        return <BooleanValue value={value} />
    }

    if (value) {
        return <TextValue value={value.toString()} />
    }
    return null
}
