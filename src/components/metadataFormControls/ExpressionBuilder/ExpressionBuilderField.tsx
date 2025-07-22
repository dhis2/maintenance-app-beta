import { TextAreaFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'

type ExpressionFieldProps = {
    name: string
    label?: string
    required?: boolean
    dataTest?: string
    validate?: (
        value?: string
    ) => Promise<string | undefined> | string | undefined
}

export const ExpressionBuilderField = ({
    name,
    label,
    required,
    dataTest,
    validate,
}: ExpressionFieldProps) => {
    return (
        <FieldRFF<string | undefined> name={name} validate={validate}>
            {({ input, meta }) => (
                <TextAreaFieldFF
                    dataTest={dataTest ?? 'expression-builder-field'}
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
