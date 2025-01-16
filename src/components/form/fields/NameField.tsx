import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { SchemaSection } from '../../../lib'
import { useValidator } from '../../../lib/models/useFieldValidators'

export function NameField({
    schemaSection,
    helpText,
}: {
    helpText?: string
    schemaSection: SchemaSection
}) {
    const validator = useValidator({ schemaSection, property: 'name' })
    const { meta } = useField('name', {
        subscription: { validating: true },
    })

    const helpString =
        helpText || i18n.t('A name should be concise and easy to recognize.')

    return (
        <FieldRFF<string | undefined>
            loading={meta.validating}
            component={InputFieldFF}
            dataTest="formfields-name"
            required
            inputWidth="400px"
            label={i18n.t('{{fieldLabel}} (required)', {
                fieldLabel: i18n.t('Name'),
            })}
            name="name"
            helpText={helpString}
            validate={(name?: string) => validator(name)}
            validateFields={[]}
        />
    )
}
