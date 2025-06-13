import i18n from '@dhis2/d2-i18n'
import { InputFieldFF, TextAreaFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { SchemaSection } from '../../../lib'
import { useValidator } from '../../../lib/models/useFieldValidators'

export function SubjectTemplateField({
    schemaSection,
    helpText,
}: {
    helpText?: string
    schemaSection: SchemaSection
}) {
    const validator = useValidator({
        schemaSection,
        property: 'subjectTemplate',
    })
    const { meta } = useField('subjectTemplate', {
        subscription: { validating: true },
    })

    const helpString =
        helpText || i18n.t('Enter the subject template for the notification.')

    return (
        <FieldRFF<string | undefined>
            loading={meta.validating}
            component={InputFieldFF}
            dataTest="formfields-subject-template"
            inputWidth="400px"
            label={i18n.t('Subject Template')}
            name="subjectTemplate"
            helpText={helpString}
            validate={(subjectTemplate?: string) => validator(subjectTemplate)}
            validateFields={[]}
        />
    )
}

export function MessageTemplateField({
    schemaSection,
    helpText,
}: {
    helpText?: string
    schemaSection: SchemaSection
}) {
    const validator = useValidator({
        schemaSection,
        property: 'messageTemplate',
    })
    const { meta } = useField('messageTemplate', {
        subscription: { validating: true },
    })

    const helpString =
        helpText || i18n.t('Enter the message template for the notification.')

    return (
        <FieldRFF<string | undefined>
            loading={meta.validating}
            component={TextAreaFieldFF}
            dataTest="formfields-message-template"
            required
            label={i18n.t('{{fieldLabel}} (required)', {
                fieldLabel: i18n.t('Message Template'),
            })}
            name="messageTemplate"
            helpText={helpString}
            validate={(messageTemplate?: string) => validator(messageTemplate)}
            validateFields={[]}
        />
    )
}
