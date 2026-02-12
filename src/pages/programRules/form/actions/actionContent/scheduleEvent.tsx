import i18n from '@dhis2/d2-i18n'
import React, { ReactNode } from 'react'
import { StandardFormField } from '../../../../../components'
import { ExpressionField, ProgramStageSelectField } from '../../../fields'

export function scheduleEvent(programId: string): ReactNode {
    return (
        <>
            <StandardFormField>
                <ProgramStageSelectField
                    programId={programId}
                    label={i18n.t('Program stage (non-repeatable)')}
                    required
                />
            </StandardFormField>
            <StandardFormField>
                <ExpressionField
                    programId={programId}
                    label={i18n.t('Date to schedule event (due date)')}
                />
            </StandardFormField>
        </>
    )
}
