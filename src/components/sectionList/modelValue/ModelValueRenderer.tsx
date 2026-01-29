import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { SchemaFieldProperty, SchemaFieldPropertyType } from '../../../lib'
import { BooleanValue } from './BooleanValue'
import { ConstantValue } from './ConstantValue'
import { DateValue } from './DateValue'
import { ModelReference, isModelReference } from './ModelReference'
import { PublicAccessValue } from './PublicAccess'
import { TextValue } from './TextValue'

export type ValueDetails = {
    propertyType: SchemaFieldProperty['propertyType']
    value: unknown
    path: string
}

export const ModelValueRenderer = ({
    path,
    value,
    propertyType,
}: ValueDetails) => {
    const hasToStringMethod = (
        value: unknown
    ): value is { toString: () => string } =>
        typeof (value as any).toString === 'function'

    if (path === 'sharing.public' && typeof value === 'string') {
        return <PublicAccessValue value={value} />
    }

    if (path === 'programType') {
        let label: string

        if (value === 'WITH_REGISTRATION') {
            label = i18n.t('Tracker program')
        } else if (value === 'WITHOUT_REGISTRATION') {
            label = i18n.t('Event program')
        } else {
            label = i18n.t('No value')
        }

        return <TextValue value={label} />
    }

    if (
        path === 'fromConstraint.relationshipEntity' ||
        path === 'toConstraint.relationshipEntity'
    ) {
        let label = (value as string).toString()

        if (value === 'PROGRAM_STAGE_INSTANCE') {
            label = i18n.t('Event')
        } else if (value === 'PROGRAM_INSTANCE') {
            label = i18n.t('Enrollment')
        } else if (value === 'TRACKED_ENTITY_INSTANCE') {
            label = i18n.t('Tracked entity')
        }

        return <TextValue value={label} />
    }

    if (propertyType === 'CONSTANT') {
        return <ConstantValue value={value as string} />
    }

    if (propertyType === 'DATE') {
        return <DateValue value={value as string} />
    }

    if (
        propertyType === SchemaFieldPropertyType.REFERENCE &&
        isModelReference(value)
    ) {
        return <ModelReference value={value} />
    }

    if (typeof value === 'boolean') {
        return <BooleanValue value={value} />
    }

    if (value !== null && value !== undefined && hasToStringMethod(value)) {
        return <TextValue value={value.toString()} />
    }

    return null
}
