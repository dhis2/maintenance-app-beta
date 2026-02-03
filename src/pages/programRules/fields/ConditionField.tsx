import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useField } from 'react-final-form'
import { ExpressionBuilderEntry } from '../../../components'
import { PaddedContainer } from '../../../components/ExpressionBuilder/PaddedContainer'

type ConditionFieldProps = {
    programId?: string
}

/** Condition expression builder; clearable so user can save with empty condition. */
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
                type="default"
            />
        </PaddedContainer>
    )
}
