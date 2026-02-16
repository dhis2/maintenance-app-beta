import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { ExpressionBuilderEntry } from '../../../components'
import { PaddedContainer } from '../../../components/ExpressionBuilder/PaddedContainer'
import { SCHEMA_SECTIONS } from '../../../lib'

type ConditionFieldProps = Readonly<{
    programId?: string
}>

export function ConditionField({ programId }: ConditionFieldProps) {
    return (
        <PaddedContainer>
            <ExpressionBuilderEntry
                fieldName="condition"
                title={i18n.t('Edit condition expression')}
                editButtonText={i18n.t('Edit condition expression')}
                setUpButtonText={i18n.t('Set up condition expression')}
                validationResource="programRules/condition/description"
                clearable={true}
                programId={programId}
                type="programRule"
                validateSchemaSection={SCHEMA_SECTIONS.programRule}
            />
        </PaddedContainer>
    )
}
