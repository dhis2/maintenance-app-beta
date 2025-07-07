import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { SchemaSection } from '../../../lib'
import { useValidator } from '../../../lib/models/useFieldValidators'

export function ShortNameField({
    helpText,
    schemaSection,
}: {
    helpText?: string
    schemaSection: SchemaSection
}) {
    const validator = useValidator({ schemaSection, property: 'shortName' })
    const { meta } = useField('shortName', {
        subscription: { validating: true },
    })

    const helpString =
        helpText || i18n.t('Often used in reports where space is limited.')

    return (
        <FieldRFF<string | undefined>
            loading={meta.validating}
            component={InputFieldFF}
            dataTest="formfields-shortName"
            required
            inputWidth="400px"
            label={i18n.t('{{fieldLabel}} (required)', {
                fieldLabel: i18n.t('Short name'),
            })}
            name="shortName"
            helpText={helpString}
            validate={(name?: string) => validator(name)}
            validateFields={[]}
        />
    )
}
