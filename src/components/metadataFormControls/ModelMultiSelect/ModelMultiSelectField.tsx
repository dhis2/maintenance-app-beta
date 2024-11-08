import { Field } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { PlainResourceQuery } from '../../../types'
import { DisplayableModel } from '../../../types/models'
import { ModelMultiSelectProps, ModelMultiSelect } from './ModelMultiSelect'

type OwnProps<TModel extends DisplayableModel> = {
    name: string
    query: PlainResourceQuery
    label?: string
    placeholder?: string
    helpText?: string
    required?: boolean
    onChange?: ModelMultiSelectProps<TModel>['onChange']
}

type ModelSingleSelectFieldProps<TModel extends DisplayableModel> = Omit<
    ModelMultiSelectProps<TModel>,
    'selected' | 'onChange'
> &
    OwnProps<TModel>

export function ModelSingleSelectField<TModel extends DisplayableModel>({
    name,
    query,
    label,
    helpText,
    required,
    onChange,
    ...modelSingleSelectProps
}: ModelSingleSelectFieldProps<TModel>) {
    const { input, meta } = useField<TModel | undefined>(name, {
        validateFields: [],
    })

    return (
        <Field
            dataTest={`formfields-modelsingleselect-${name}`}
            error={meta.invalid}
            validationText={(meta.touched && meta.error?.toString()) || ''}
            name={name}
            label={label}
            helpText={helpText}
            required={required}
        >
            <ModelMultiSelect<TModel>
                {...modelSingleSelectProps}
                selected={input.value}
                onChange={(selected) => {
                    input.onChange(selected)
                    input.onBlur()
                    onChange?.(selected)
                }}
                query={query}
            />
        </Field>
    )
}
