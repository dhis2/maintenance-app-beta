import { Field } from '@dhis2/ui'
import React from 'react'
import { FieldRenderProps, useField, UseFieldConfig } from 'react-final-form'
import {
    DisplayableModel,
    PartialLoadedDisplayableModel,
} from '../../../types/models'
import { ModelSingleSelectProps, ModelSingleSelect } from './ModelSingleSelect'

type OwnProps<TModel extends PartialLoadedDisplayableModel> = {
    label?: string
    placeholder?: string
    helpText?: string
    required?: boolean
    onChange?: ModelSingleSelectProps<TModel>['onChange']
}

type RelevantRenderProps<TModel extends PartialLoadedDisplayableModel> = {
    input: Pick<
        FieldRenderProps<TModel | undefined>['input'],
        'value' | 'onChange' | 'onBlur' | 'name'
    >
    meta: Pick<
        FieldRenderProps<TModel | undefined>['meta'],
        'invalid' | 'touched' | 'error'
    >
}
type RelevantUseFieldProps<TModel extends PartialLoadedDisplayableModel> = Pick<
    UseFieldConfig<TModel | undefined>,
    'validate' | 'validateFields' | 'initialValue' | 'format' | 'parse' | 'data'
> & {
    name: string
}

export type ModelSingleSelectFieldProps<
    TModel extends PartialLoadedDisplayableModel = DisplayableModel
> = Omit<ModelSingleSelectProps<TModel>, 'selected' | 'onChange'> &
    OwnProps<TModel>
export function ModelSingleSelectField<
    TModel extends PartialLoadedDisplayableModel
>({
    label,
    helpText,
    required,
    onChange,
    // react-final-form props
    // validate,
    // validateFields,
    // initialValue,
    // format,
    // parse,
    // data,
    input,
    meta,
    ...modelSingleSelectProps
}: ModelSingleSelectFieldProps<TModel> & RelevantRenderProps<TModel>) {
    return (
        <Field
            dataTest={`formfields-modelsingleselect-${name}`}
            error={meta.invalid}
            validationText={(meta.touched && meta.error?.toString()) || ''}
            name={input.name}
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
                invalid={meta.touched && !!meta.error}
            />
        </Field>
    )
}

export function ModelSingleSelectFormField<TModel extends DisplayableModel>({
    // react-final-form props
    name,
    validateFields,
    validate,
    initialValue,
    format,
    parse,
    data,
    ...modelSingleSelectProps
}: ModelSingleSelectFieldProps<TModel> & RelevantUseFieldProps<TModel>) {
    const { input, meta } = useField<TModel | undefined>(name, {
        validateFields: validateFields ?? [],
        validate,
        initialValue,
        format,
        parse,
        data,
    })

    return (
        <ModelSingleSelectField
            input={input}
            meta={meta}
            {...modelSingleSelectProps}
        />
    )
}
