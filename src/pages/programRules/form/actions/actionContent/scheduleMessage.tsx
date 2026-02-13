import i18n from '@dhis2/d2-i18n'
import React, { ReactNode } from 'react'
import { StandardFormField } from '../../../../../components'
import { ExpressionField, NotificationTemplateField } from '../../../fields'

export function scheduleMessage(programId: string): ReactNode {
    return (
        <>
            <StandardFormField>
                <NotificationTemplateField programId={programId} required />
            </StandardFormField>
            <StandardFormField>
                <ExpressionField
                    programId={programId}
                    label={i18n.t('Date to send message.')}
                />
            </StandardFormField>
        </>
    )
}
