import i18n from '@dhis2/d2-i18n'
import { Field, IconArrowRight24 } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { PlainResourceQuery, Optional } from '../../types'
import { DisplayableModel } from '../../types/models'
import {
    ModelMultiSelectFieldProps,
    ModelMultiSelectFormField,
} from '../metadataFormControls'
import { ModelSingleSelectFormField } from '../metadataFormControls/ModelSingleSelect'
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
        <ModelMultiSelectFormField
            name="sources"
            label={i18n.t('Sources')}
            maxHeight="150px"
            placeholder={props.placeholder || i18n.t('Select models to merge')}
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
    noMatchWithoutFilterText?: string
}

export const BaseTargetField = ({
    query,
    label,
    placeholder,
    noMatchWithoutFilterText,
}: BaseTargetFieldProps) => {
    const sourcesValues = useField<DisplayableModel[]>('sources', {
        subscription: { value: true },
    }).input.value

    return (
        <ModelSingleSelectFormField
            name="target"
            query={query}
            transform={(availableData) =>
                availableData.filter(
                    (model) => !sourcesValues.some((s) => s.id === model.id)
                )
            }
            label={label || i18n.t('Target')}
            placeholder={
                placeholder || i18n.t('Select the model to merge into')
            }
            noMatchWithoutFilterText={
                noMatchWithoutFilterText ??
                i18n.t(
                    'No potential targets available. Remove an item from sources.'
                )
            }
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
