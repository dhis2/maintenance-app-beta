import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'

export function ConfidentialField({
    encryptionEnabled,
}: Readonly<{
    encryptionEnabled: boolean
}>) {
    return (
        <FieldRFF
            component={CheckboxFieldFF}
            dataTest="formfields-confidential"
            name="confidential"
            label={i18n.t('Make this attribute confidential')}
            type="checkbox"
            disabled={!encryptionEnabled}
            helpText={i18n.t(
                'Confidential tracker entity attributes are hidden from search and only supported when system encryption is enabled.'
            )}
            validateFields={[]}
        />
    )
}
