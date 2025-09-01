import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import { DefaultEditFormContents, FormBase } from '../../components'
import { DEFAULT_FIELD_FILTERS, SECTIONS_MAP, useOnSubmitEdit } from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { PickWithFieldFilters } from '../../types/generated'
import { OptionGroupSet } from '../../types/models'
import OptionGroupSetFormFields from './form/OptionGroupSetFormFields'
import { validate } from './form/optionGroupSetSchema'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    'shortName',
    'code',
    'description',
    'dataDimensions',
    'optionSet[id,displayName]',
    'optionGroups[id,displayName]',
] as const

export type OptionGroupSetFormValues = PickWithFieldFilters<
    OptionGroupSet,
    typeof fieldFilters
>

export const Component = () => {
    const section = SECTIONS_MAP.optionGroupSet
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string
    const query = {
        resource: 'optionGroupSets',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const optionGroupSetQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<OptionGroupSetFormValues>,
    })

    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ section, modelId })}
            initialValues={optionGroupSetQuery.data}
            validate={validate}
            includeAttributes={false}
        >
            <DefaultEditFormContents section={section}>
                <OptionGroupSetFormFields />
            </DefaultEditFormContents>
        </FormBase>
    )
}
