// @ts-nocheck
import i18n from '@dhis2/d2-i18n'
import React from 'react'

type ModelReference = {
    id: string
    displayName: string
}

export const isModelReference = (value: unknown): value is ModelReference => {
    const asModelReference = value as ModelReference
    return !!asModelReference.displayName && !!asModelReference.id
}

export const ModelReference = ({ value }: { value?: ModelReference }) => {
    let displayValue = value?.displayName || value?.name
    // default categoryCombos should display as None
    if (displayValue === 'default') {
        displayValue = i18n.t('None')
    }
    return <span>{displayValue}</span>
}
