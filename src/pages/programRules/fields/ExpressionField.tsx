import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { ExpressionBuilderEntry } from '../../../components'
import { PaddedContainer } from '../../../components/ExpressionBuilder/PaddedContainer'
import { SECTIONS_MAP } from '../../../lib'

export function ExpressionField({
    fieldName = 'data',
    label,
    programId,
    clearable = true,
}: Readonly<{
    fieldName?: string
    label: string
    programId?: string
    clearable?: boolean
}>) {
    return (
        <>
            <PaddedContainer>
                <ExpressionBuilderEntry
                    fieldName={fieldName}
                    title={i18n.t('Edit expression')}
                    editButtonText={i18n.t('Edit expression')}
                    setUpButtonText={i18n.t('Set up expression')}
                    validationResource="programRules/condition/description"
                    clearable={clearable}
                    programId={programId}
                    type="programRule"
                    validateSchemaSection={SECTIONS_MAP.programRule}
                    validateProperty={fieldName}
                />
            </PaddedContainer>
            <span style={{ color: 'var(--colors-grey600)', fontSize: '14px' }}>
                {label}
            </span>
        </>
    )
}
