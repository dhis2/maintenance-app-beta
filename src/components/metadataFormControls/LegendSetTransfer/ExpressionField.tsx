import { TextAreaFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'

type ExpressionFieldProps = {
    name: string
    label: string
    required?: boolean
    validate?: (
        value?: string
    ) => Promise<string | undefined> | string | undefined
}

export const ExpressionField = ({
    name,
    label,
    required = true,
    validate,
}: ExpressionFieldProps) => {
    return (
        <FieldRFF<string | undefined> name={name} validate={validate}>
            {({ input, meta }) => (
                <TextAreaFieldFF
                    input={input}
                    meta={meta}
                    required={required}
                    inputWidth="400px"
                    label={label}
                    validationText={meta.error}
                    warning={!!meta.error && meta.touched}
                />
            )}
        </FieldRFF>
    )
}
