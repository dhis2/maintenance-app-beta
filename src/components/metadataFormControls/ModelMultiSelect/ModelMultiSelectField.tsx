import { Field } from '@dhis2/ui'
import React from 'react'
import { FieldRenderProps, useField } from 'react-final-form'
import { PlainResourceQuery } from '../../../types'
import { DisplayableModel } from '../../../types/models'
import { ModelMultiSelectProps, ModelMultiSelect } from './ModelMultiSelect'

type RelevantRenderProps<TModel extends DisplayableModel> = {
    input: Pick<
        FieldRenderProps<TModel[] | undefined>['input'],
        'value' | 'onChange' | 'onBlur'
    >
    meta: Pick<
        FieldRenderProps<TModel[] | undefined>['meta'],
        'invalid' | 'touched' | 'error'
    >
}

type OwnProps<TModel extends DisplayableModel> = {
    name: string
    query: PlainResourceQuery
    label?: string
    placeholder?: string
    helpText?: string
    required?: boolean
    onChange?: ModelMultiSelectProps<TModel>['onChange']
}

export type ModelMultiSelectFieldProps<TModel extends DisplayableModel> = Omit<
    ModelMultiSelectProps<TModel>,
    'selected' | 'onChange'
> &
    OwnProps<TModel>

export function ModelMultiSelectField<TModel extends DisplayableModel>({
    name,
    query,
    label,
    helpText,
    required,
    onChange,
    input,
    meta,
    dataTest,
    ...modelSingleSelectProps
}: ModelMultiSelectFieldProps<TModel> & RelevantRenderProps<TModel>) {
    return (
        <Field
            dataTest={dataTest ?? `formfields-modelmultiselect-${name}`}
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
                onChange={(payload) => {
                    input.onChange(payload.selected)
                    input.onBlur()
                    onChange?.(payload)
                }}
                query={query}
            />
        </Field>
    )
}

export function ModelMultiSelectFormField<TModel extends DisplayableModel>({
    name,
    ...modelSingleSelectProps
}: ModelMultiSelectFieldProps<TModel>) {
    const { input, meta } = useField<TModel[] | undefined>(name, {
        validateFields: [],
    })

    return (
        <ModelMultiSelectField
            name={name}
            input={input}
            meta={meta}
            {...modelSingleSelectProps}
        />
    )
}
