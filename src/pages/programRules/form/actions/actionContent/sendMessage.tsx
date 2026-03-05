import React, { ReactNode } from 'react'
import { StandardFormField } from '../../../../../components'
import { NotificationTemplateField } from '../../../fields'

export function sendMessage(programId: string, isEdit?: boolean): ReactNode {
    return (
        <StandardFormField>
            <NotificationTemplateField
                programId={programId}
                required
                disabled={isEdit}
            />
        </StandardFormField>
    )
}
