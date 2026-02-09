import React, { ReactNode } from 'react'
import { StandardFormField } from '../../../../../components'
import { NotificationTemplateField } from '../../../fields'

export function sendMessageFields(programId: string): ReactNode {
    return (
        <StandardFormField>
            <NotificationTemplateField programId={programId} required />
        </StandardFormField>
    )
}
