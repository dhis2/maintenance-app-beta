import { TextAreaFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { useExpressionValidator } from './useExpressionValidator'

type ExpressionFieldProps = {
    name: string
    label?: string
    required?: boolean
    dataTest?: string
    validationResource: string
}

export const ExpressionBuilderField = ({
    name,
    label,
    required,
    dataTest,
    validationResource,
}: ExpressionFieldProps) => {
    const [validate] = useExpressionValidator(validationResource)
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
                />
            )}
        </FieldRFF>
    )
}
