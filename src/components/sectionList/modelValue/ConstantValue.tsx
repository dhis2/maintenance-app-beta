import React from 'react'
import { getConstantTranslation } from '../../../lib'

export const ConstantValue = ({ value }: { value?: string }) => (
    <span>{getConstantTranslation(value || '')}</span>
)
