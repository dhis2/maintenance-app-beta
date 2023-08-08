import i18n from '@dhis2/d2-i18n'
import React from 'react'
import type { ValueDetails } from './ModelValue'
import { PublicAccessValue, isSharing } from './PublicAccess'
import { TextValue } from './TextValue'

export const ModelValueRenderer = ({ value, schemaProperty }: ValueDetails) => {
    if (schemaProperty.fieldName === 'sharing' && isSharing(value)) {
        return <PublicAccessValue value={value} />
    }

    if (typeof value === 'string') {
        return <TextValue value={value} />
    }
    return <span>{i18n.t('An error occurred while rendering the value')} </span>
}
