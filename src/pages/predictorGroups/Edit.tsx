import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import { DefaultEditFormContents, FormBase } from '../../components'
import { DEFAULT_FIELD_FILTERS, SECTIONS_MAP, useOnSubmitEdit } from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { PredictorGroup, PickWithFieldFilters } from '../../types/generated'
import { PredictorGroupFormFields } from './form/PredictorGroupFormFields'
import { validate } from './form/predictorGroupSchema'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    'code',
    'description',
    'predictors[id,displayName]',
] as const

export type PredictorGroupFormValues = PickWithFieldFilters<
    PredictorGroup,
    typeof fieldFilters
>

export const Component = () => {
    const section = SECTIONS_MAP.predictorGroup
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string
    const query = {
        resource: 'predictorGroups',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const predictorGroupsQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<PredictorGroupFormValues>,
    })

    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ section, modelId })}
            initialValues={predictorGroupsQuery.data}
            validate={validate}
            includeAttributes={false}
        >
            <DefaultEditFormContents section={section}>
                <PredictorGroupFormFields />
            </DefaultEditFormContents>
        </FormBase>
    )
}
