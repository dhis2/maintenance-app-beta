import { Field } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { PlainResourceQuery } from '../../../types'
import { DisplayableModel } from '../../../types/models'
import {
    ModelSingleSelectProps,
    ModelSingleSelect,
} from './ModelSingleSelectRefactor'

// this currently does not need a generic, because the value of the field is not passed
// or available from props. However if it's made available,
// the generic of <TModel extends DisplayableModel> should be added.
type ModelSingleSelectFieldProps = {
    name: string
    query: PlainResourceQuery
    label?: string
    placeholder?: string
    helpText?: string
} & ModelSingleSelectProps<DisplayableModel>

export function ModelSingleSelectField({
    name,
    query,
    label,
    helpText,
    ...modelSingleSelectProps
}: ModelSingleSelectFieldProps) {
    const { input, meta } = useField<DisplayableModel | undefined>(name, {
        validateFields: [],
    })

    return (
        <Field
            dataTest="formfields-modelsingleselect"
            error={meta.invalid}
            validationText={(meta.touched && meta.error?.toString()) || ''}
            name={name}
            label={label}
            helpText={helpText}
        >
            <ModelSingleSelect
                {...modelSingleSelectProps}
                selected={input.value}
                onChange={({ selected }) => {
                    input.onChange(selected)
                    input.onBlur()
                }}
                query={query}
            />
        </Field>
    )
}
