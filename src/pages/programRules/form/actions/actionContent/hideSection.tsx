import React, { ReactNode } from 'react'
import { StandardFormField } from '../../../../../components'
import { ProgramStageSectionField } from '../../../fields'

export function hideSection(programId: string): ReactNode {
    return (
        <StandardFormField>
            <ProgramStageSectionField programId={programId} required />
        </StandardFormField>
    )
}
