import { Field, IconArrowRight24 } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { PlainResourceQuery, Optional } from '../../types'
import { DisplayableModel } from '../../types/models'
import {
    ModelMultiSelectField,
    ModelMultiSelectFieldProps,
} from '../metadataFormControls'
import { ModelSingleSelectField } from '../metadataFormControls/ModelSingleSelect'
import css from './MergeFields.module.css'

type BaseSourceFieldProps = Optional<
    ModelMultiSelectFieldProps<DisplayableModel>,
    'name'
>

export const BaseSourcesField = (props: BaseSourceFieldProps) => {
    // need targetValue to remove it from the available sources
    const targetValue = useField<DisplayableModel>('target', {
        subscription: { value: true },
    }).input.value

    return (
        <ModelMultiSelectField
            name="sources"
            label="Sources"
            maxHeight="150px"
            placeholder={props.placeholder || 'Select models to merge'}
            // use select to filter out the target from available sources
            transform={(availableSources) =>
                availableSources.filter((s) => s.id !== targetValue?.id)
            }
            {...props}
        />
    )
}

type BaseTargetFieldProps = {
    query: PlainResourceQuery
    label?: string
    placeholder?: string
}

export const BaseTargetField = ({
    query,
    label,
    placeholder,
}: BaseTargetFieldProps) => {
    const sourcesValues = useField<DisplayableModel[]>('sources', {
        subscription: { value: true },
    }).input.value

    return (
        <ModelSingleSelectField
            name="target"
            query={query}
            transform={(availableData) =>
                availableData.filter(
                    (model) => !sourcesValues.some((s) => s.id === model.id)
                )
            }
            label={label || 'Target'}
            placeholder={placeholder || 'Select the model to merge into'}
        />
    )
}

export const MergeSourcesTargetWrapper = ({
    children,
}: React.PropsWithChildren) => {
    return (
        <div className={css.targetSourceWrapper}>
            {children}
            <IconArrowRight24 />
        </div>
    )
}

export const ConfirmField = () => {
    return <Field name="confirm" label="Confirm" required></Field>
}
