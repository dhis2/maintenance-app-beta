import React from 'react'
import { Field, FieldInputProps } from 'react-final-form'

type OwnProps<TFieldValue, TInputValue> = {
    label?: string
}

export type EnhancedFieldProps<TFIeldValue, TInputValue> = OwnProps<
    TFIeldValue,
    TInputValue
> &
    FieldInputProps<any>

/* The intention of this component is to have a general wrapper around final-form.
    Currently it does not do much, but it could be used to add some common functionality

    Futre plans:
        Improve typing of react-final-form field
        Have a typed "data" prop for field. eg for field-rules
        Add some handling of field-rules, eg. show/hide field based on field-rules
*/

export const EnhancedField = <TFieldValue = any, TInputValue = any>(
    props: EnhancedFieldProps<TFieldValue, TInputValue>
) => {
    return <Field {...props} />
}
