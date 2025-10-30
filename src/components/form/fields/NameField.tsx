import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React, { useState } from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { SchemaSection, useIsFieldValueUnique, useSchema } from '../../../lib'
import { useValidator } from '../../../lib/models/useFieldValidators'

export function NameField({
    schemaSection,
    helpText,
    modelId,
}: {
    helpText?: string
    schemaSection: SchemaSection
    modelId?: string
}) {
    const validator = useValidator({ schemaSection, property: 'name', modelId })
    const schema = useSchema(schemaSection.name)
    const propertyDetails = schema.properties['name']
    const [warning, setWarning] = useState<string | undefined>()

    const checkNameDuplicate = useIsFieldValueUnique({
        model: schemaSection.namePlural,
        field: 'name',
        message: i18n.t(
            'This name is already in use. Consider updating the name to avoid a duplication.'
        ),
    })
    const uniquenessWarner = propertyDetails.unique
        ? undefined
        : checkNameDuplicate

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
                            if (uniquenessWarner) {
                                const warning = await uniquenessWarner(value)
                                setWarning(warning)
                            }
                        },
                    }}
                    meta={meta}
                    loading={meta.validating}
                    validateFields={[]}
                    dataTest="formfields-name"
                    required
                    inputWidth="400px"
                    label={i18n.t('{{fieldLabel}} (required)', {
                        fieldLabel: i18n.t('Name'),
                    })}
                    helpText={helpString}
                    validationText={warning}
                    warning={!!warning}
                />
            )}
        </FieldRFF>
    )
}
