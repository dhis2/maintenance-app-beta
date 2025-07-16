import { Field, FieldProps } from '@dhis2/ui'
import React from 'react'
import { FieldMetaState } from 'react-final-form'

export type FieldWrapperProps = FieldProps & {
    meta: FieldMetaState<unknown>
}
export const FieldWrapper = ({
    children,
    meta,
    ...fieldProps
}: FieldWrapperProps) => {
    return (
        <Field
            error={meta.touched && meta.error}
            validationText={meta.touched ? meta.error?.toString() : undefined}
            {...fieldProps}
        >
            {children}
        </Field>
    )
}
