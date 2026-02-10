import React, { ReactNode } from 'react'
import { StandardFormField } from '../../../../../components'
import { ProgramStageSelectField } from '../../../fields'

export function createEvent(programId: string): ReactNode {
    return (
        <StandardFormField>
            <ProgramStageSelectField programId={programId} required />
        </StandardFormField>
    )
}
