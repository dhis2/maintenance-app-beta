import React from 'react'
import { getConstantTranslation } from '../../../constants/translatedModelConstants'

export const ConstantValue = ({ value }: { value?: string }) => (
    <span>{getConstantTranslation(value || '')}</span>
)
