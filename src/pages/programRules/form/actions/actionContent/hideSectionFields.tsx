import React, { ReactNode } from 'react'
import { StandardFormField } from '../../../../../components'
import { ProgramStageSectionField } from '../../../fields'

export function hideSectionFields(programId: string): ReactNode {
    return (
        <StandardFormField>
            <ProgramStageSectionField programId={programId} required />
        </StandardFormField>
    )
}
