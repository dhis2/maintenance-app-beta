import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { SchemaSection } from '../../../lib'
import { useValidator } from '../../../lib/models/useFieldValidators'

export function NameField({
    schemaSection,
    helpText,
    extraValidator,
}: {
    helpText?: string
    schemaSection: SchemaSection
    extraValidator?: (value?: string) => Promise<string | undefined> | undefined
}) {
    const validator = useValidator({ schemaSection, property: 'name' })
    const { meta } = useField('name', {
        subscription: { validating: true },
    })

    const helpString =
        helpText || i18n.t('A name should be concise and easy to recognize.')

    const validate = async (name?: string) => {
        const error = await validator(name)
        if (error) {
            return error
        }

        if (extraValidator) {
            return await extraValidator(name)
        }

        return undefined
    }

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
            validate={validate}
            validateFields={[]}
        />
    )
}
