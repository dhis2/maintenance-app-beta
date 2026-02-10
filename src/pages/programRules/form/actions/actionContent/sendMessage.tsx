import React, { ReactNode } from 'react'
import { StandardFormField } from '../../../../../components'
import { NotificationTemplateField } from '../../../fields'

export function sendMessage(programId: string): ReactNode {
    return (
        <StandardFormField>
            <NotificationTemplateField programId={programId} required />
        </StandardFormField>
    )
}
