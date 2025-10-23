import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React, { useState } from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { SchemaSection } from '../../../lib'
import { useValidator } from '../../../lib/models/useFieldValidators'

export function NameField({
    schemaSection,
    helpText,
    modelId,
    warner,
}: {
    helpText?: string
    schemaSection: SchemaSection
    modelId?: string
    warner?: (value?: string) => Promise<string | undefined> | undefined
}) {
    const validator = useValidator({ schemaSection, property: 'name', modelId })
    const [warning, setWarning] = useState<string | undefined>()

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
                            if (warner) {
                                const warning = await warner(value)
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
