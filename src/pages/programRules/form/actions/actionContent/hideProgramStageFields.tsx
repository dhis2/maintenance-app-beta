import i18n from '@dhis2/d2-i18n'
import React, { ReactNode } from 'react'
import { StandardFormField } from '../../../../../components'
import { ProgramStageSelectField } from '../../../fields'

export function hideProgramStageFields(programId: string): ReactNode {
    return (
        <StandardFormField>
            <ProgramStageSelectField
                programId={programId}
                label={i18n.t('Program stage')}
                required
            />
        </StandardFormField>
    )
}
