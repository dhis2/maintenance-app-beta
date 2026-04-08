import { Field } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { useHref } from 'react-router'
import {
    DisplayableModel,
    PartialLoadedDisplayableModel,
} from '../../../types/models'
import { EditableInputWrapper } from '../../EditableInputWrapper'
import {
    ModelSingleSelectFF,
    ModelSingleSelectFieldProps,
    RelevantRenderProps,
    RelevantUseFieldProps,
} from './ModelSingleSelectField'
import { useRefreshModelSingleSelect } from './useRefreshSingleSelect'

export function ModelSingleSelectRefreshableField<
    TModel extends PartialLoadedDisplayableModel
>({
    label,
    helpText,
    required,
    input,
    meta,
    dataTest,
    refreshResource,
    ...modelSingleSelectProps
}: ModelSingleSelectFieldProps<TModel> &
    RelevantRenderProps<TModel> & { refreshResource: string }) {
    const newLink = useHref(`/${refreshResource}/new`)
    const refresh = useRefreshModelSingleSelect({
        resource: refreshResource,
    })

    return (
        <Field
            dataTest={dataTest ?? `formfields-modelsingleselect-${input.name}`}
            error={meta.invalid}
            validationText={(meta.touched && meta.error?.toString()) || ''}
            name={input.name}
            label={label}
            helpText={helpText}
            required={required}
        >
            <EditableInputWrapper
                onRefresh={() => refresh()}
                onAddNew={() => window.open(newLink, '_blank')}
            >
                <ModelSingleSelectFF
                    {...modelSingleSelectProps}
                    input={input}
                    meta={meta}
                />
            </EditableInputWrapper>
        </Field>
    )
}

export function ModelSingleSelectRefreshableFormField<
    TModel extends DisplayableModel
>({
    // react-final-form props
    name,
    validateFields,
    validate,
    initialValue,
    format,
    parse,
    data,
    refreshResource,
    ...modelSingleSelectProps
}: ModelSingleSelectFieldProps<TModel> &
    RelevantUseFieldProps<TModel> & {
        refreshResource: string
    }) {
    const { input, meta } = useField<TModel | undefined>(name, {
        validateFields: validateFields ?? [],
        validate,
        initialValue,
        format,
        parse,
        data,
    })

    return (
        <ModelSingleSelectRefreshableField
            input={input}
            meta={meta}
            refreshResource={refreshResource}
            {...modelSingleSelectProps}
        />
    )
}
