import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import { DefaultEditFormContents, FormBase } from '../../components'
import { DEFAULT_FIELD_FILTERS, SECTIONS_MAP, useOnSubmitEdit } from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { PickWithFieldFilters } from '../../types/generated'
import { IndicatorGroupSet } from '../../types/models'
import IndicatorGroupSetFormFields from './form/IndicatorGroupSetFormFields'
import { validate } from './form/indicatorGroupSetSchema'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    'shortName',
    'code',
    'description',
    'compulsory',
    'indicatorGroups[id,displayName]',
] as const

export type IndicatorGroupSetFormValues = PickWithFieldFilters<
    IndicatorGroupSet,
    typeof fieldFilters
>

export const Component = () => {
    const section = SECTIONS_MAP.indicatorGroupSet
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string
    const query = {
        resource: 'indicatorGroupSets',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const indicatorGroupSetQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<IndicatorGroupSetFormValues>,
    })

    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ section, modelId })}
            initialValues={indicatorGroupSetQuery.data}
            validate={validate}
            includeAttributes={false}
        >
            <DefaultEditFormContents section={section}>
                <IndicatorGroupSetFormFields />
            </DefaultEditFormContents>
        </FormBase>
    )
}
