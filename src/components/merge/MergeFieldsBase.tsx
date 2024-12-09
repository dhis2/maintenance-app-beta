import { Field, IconArrowRight24 } from '@dhis2/ui'
import React, { useState } from 'react'
import { useField } from 'react-final-form'
import { useDebouncedCallback } from 'use-debounce'
import { useModelMultiSelectQuery } from '../../lib'
import { PlainResourceQuery, Optional } from '../../types'
import { DisplayableModel } from '../../types/models'
import {
    ModelMultiSelectField,
    ModelMultiSelectFieldProps,
} from '../metadataFormControls'
import { SearchableSingleSelect } from '../SearchableSingleSelect'
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
            placeholder="Select models to merge"
            // use select to filter out the target from available sources
            select={(availableSources) =>
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
    const [searchTerm, setSearchTerm] = useState<string>('')
    // we dont have a good reusable field for ModelSingleSelect, so we need more logic here
    // TODO: add a reusable field for ModelSingleSelect, like we have for ModelMultiSelect/ModelTransfer
    const searchFilter = `identifiable:token:${searchTerm}`
    const filter: string[] = searchTerm ? [searchFilter] : []
    const params = query.params

    const handleFilterChange = useDebouncedCallback(({ value }) => {
        if (value != undefined) {
            setSearchTerm(value)
        }
    }, 250)

    const targetField = useField<DisplayableModel | undefined>('target', {})
    const queryResult = useModelMultiSelectQuery<DisplayableModel>({
        query: {
            ...query,
            params: {
                ...params,
                order: 'displayName:asc',
                fields: ['id', 'displayName'],
                pageSize: 10,
                filter: filter.concat(params?.filter || []),
            },
        },
        selected: [],
    })
    const sourcesValues = useField<DisplayableModel[]>('sources', {
        subscription: { value: true },
    }).input.value

    const options = queryResult.available
        // filter out the sources from the available targets
        .filter((model) => !sourcesValues.some((s) => s.id === model.id))
        .map((option) => ({
            value: option.id,
            label: option.displayName,
        }))

    return (
        <Field
            name="target"
            label={label || 'Target'}
            dataTest="formfields-mergetarget"
            error={targetField.meta.invalid}
            validationText={
                ((targetField.meta.touched || targetField.meta.submitFailed) &&
                    targetField.meta.error?.toString()) ||
                ''
            }
            required
        >
            <SearchableSingleSelect
                loading={queryResult.isLoading}
                onFilterChange={handleFilterChange}
                onEndReached={() =>
                    queryResult.availableQuery.isLoading &&
                    queryResult.availableQuery.fetchNextPage()
                }
                onRetryClick={queryResult.availableQuery.refetch}
                error={queryResult.error?.toString()}
                options={options}
                showEndLoader={!!queryResult.availableQuery.hasNextPage}
                selected={targetField.input.value?.id}
                onChange={({ selected }) => {
                    targetField.input.onChange(
                        queryResult.available.find((d) => d.id === selected)
                    )
                }}
                placeholder={placeholder || 'Select the model to merge into'}
            />
        </Field>
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
