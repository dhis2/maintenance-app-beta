import { Field } from '@dhis2/ui'
import React from 'react'
import { useField, UseFieldConfig } from 'react-final-form'
import { DisplayableModel } from '../../../types/models'
import { ModelSingleSelectProps, ModelSingleSelect } from './ModelSingleSelect'

type OwnProps<TModel extends DisplayableModel> = {
    name: string
    label?: string
    placeholder?: string
    helpText?: string
    required?: boolean
    onChange?: ModelSingleSelectProps<TModel>['onChange']
}

type RelevantUseFieldProps<TModel extends DisplayableModel> = Pick<
    UseFieldConfig<TModel | undefined>,
    'validate' | 'validateFields' | 'initialValue' | 'format' | 'parse' | 'data'
>

export type ModelSingleSelectFieldProps<
    TModel extends DisplayableModel = DisplayableModel
> = Omit<ModelSingleSelectProps<TModel>, 'selected' | 'onChange'> &
    OwnProps<TModel> &
    RelevantUseFieldProps<TModel>

export function ModelSingleSelectField<TModel extends DisplayableModel>({
    name,
    label,
    helpText,
    required,
    onChange,
    // react-final-form props
    validate,
    validateFields,
    initialValue,
    format,
    parse,
    data,
    ...modelSingleSelectProps
}: ModelSingleSelectFieldProps<TModel>) {
    const { input, meta } = useField<TModel | undefined>(name, {
        validateFields: validateFields ?? [],
        validate,
        initialValue,
        format,
        parse,
        data,
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
            <ModelSingleSelect<TModel>
                {...modelSingleSelectProps}
                selected={input.value}
                onChange={(selected) => {
                    input.onChange(selected)
                    input.onBlur()
                    onChange?.(selected)
                }}
            />
        </Field>
    )
}
