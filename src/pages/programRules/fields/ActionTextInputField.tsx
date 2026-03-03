import i18n from '@dhis2/d2-i18n'
import { Box, InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field } from 'react-final-form'

export function ActionTextInputField({
    name,
    label,
    required,
}: Readonly<{
    name: string
    label: string
    required?: boolean
}>) {
    return (
        <Field name={name}>
            {({ input, meta }) => (
                <Box width="400px" minWidth="100px">
                    <InputFieldFF
                        input={input}
                        meta={meta}
                        label={
                            required
                                ? i18n.t('{{label}} (required)', {
                                      label,
                                      nsSeparator: '~:~',
                                  })
                                : label
                        }
                        required={required}
                    />
                </Box>
            )}
        </Field>
    )
}
