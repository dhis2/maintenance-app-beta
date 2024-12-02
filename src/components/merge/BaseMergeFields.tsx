import React from 'react'
import { DisplayableModel } from '../../types/models'
import {
    ModelMultiSelectField,
    ModelMultiSelectFieldProps,
} from '../metadataFormControls/ModelMultiSelect'
import css from './MergeFields.module.css'
import { IconArrowRight24 } from '@dhis2/ui'
import { useField } from 'react-final-form'

type Optional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>

type BaseSourceFieldProps = Optional<
    ModelMultiSelectFieldProps<DisplayableModel>,
    'name'
>

export const BaseSourcesField = (props: BaseSourceFieldProps) => {
    const targetValue = useField<DisplayableModel[]>('target', {
        subscription: { value: true },
    }).input.value

    return (
        <ModelMultiSelectField
            name="sources"
            label="Sources"
            maxHeight="150px"
            // use select to filter out the target from available sources
            select={(availableSources) =>
                availableSources.filter((s) => s.id !== targetValue?.[0]?.id)
            }
            {...props}
        />
    )
}

export const BaseTargetField = (props: BaseSourceFieldProps) => {
    const sourcesValues = useField<DisplayableModel[]>('sources', {
        subscription: { value: true },
    }).input.value

    return (
        <ModelMultiSelectField
            name="target"
            label="Target"
            maxHeight="150px"
            select={(availableTargets) =>
                availableTargets.filter(
                    (t) => !sourcesValues.some((s) => s.id === t.id)
                )
            }
            {...props}
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
