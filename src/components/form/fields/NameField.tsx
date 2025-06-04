import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, useForm } from 'react-final-form'
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
    const form = useForm()

    const helpString =
        helpText || i18n.t('A name should be concise and easy to recognize.')

    return (
        <FieldRFF name="name" validate={validator}>
            {({ input, meta }) => (
                <InputFieldFF
                    input={{
                        ...input,
                        onChange: async (value: string) => {
                            input.onChange(value)

                            if (extraValidator) {
                                const warning = await extraValidator(value)
                                form.change('nameWarning', warning)
                            }
                        },
                    }}
                    meta={meta}
                    dataTest="formfields-name"
                    required
                    inputWidth="400px"
                    label={i18n.t('{{fieldLabel}} (required)', {
                        fieldLabel: i18n.t('Name'),
                    })}
                    helpText={helpString}
                    validationText={
                        form.getState().values.nameWarning &&
                        i18n.t('This name may not be unique')
                    }
                    warning={!!form.getState().values.nameWarning}
                />
            )}
        </FieldRFF>
    )
}
