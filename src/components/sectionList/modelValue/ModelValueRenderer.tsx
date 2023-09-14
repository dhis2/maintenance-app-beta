import React from 'react'
import { SchemaFieldProperty } from '../../../lib'
import { BooleanValue } from './BooleanValue'
import { ConstantValue } from './ConstantValue'
import { DateValue } from './DateValue'
import { PublicAccessValue, isSharing } from './PublicAccess'
import { TextValue } from './TextValue'

export type ValueDetails = {
    schemaProperty: SchemaFieldProperty
    value: unknown
}

export const ModelValueRenderer = ({ value, schemaProperty }: ValueDetails) => {
    // if (schemaProperty.fieldName === 'sharing' && isSharing(value)) {
    //     return <PublicAccessValue value={value} />
    // }

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
