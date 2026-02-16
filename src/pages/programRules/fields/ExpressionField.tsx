import i18n from '@dhis2/d2-i18n'
import { Box } from '@dhis2/ui'
import React from 'react'
import { ExpressionBuilderEntry } from '../../../components'
import { PaddedContainer } from '../../../components/ExpressionBuilder/PaddedContainer'
import { SchemaName, SchemaSection } from '../../../lib'
import styles from '../form/actions/ProgramRuleActionForm.module.css'

const programRuleActionSchemaSection = {
    name: 'programRuleAction' as SchemaName,
    namePlural: 'programRuleActions',
} as SchemaSection

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
        <Box width="800px" minWidth="100px">
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
                    validateSchemaSection={programRuleActionSchemaSection}
                    validateProperty={fieldName}
                />
            </PaddedContainer>
            <span className={styles.expressionLabel}>{label}</span>
        </Box>
    )
}
