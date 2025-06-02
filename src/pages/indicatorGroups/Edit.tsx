import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import { DefaultEditFormContents, FormBase } from '../../components'
import {
    ATTRIBUTE_VALUES_FIELD_FILTERS,
    DEFAULT_FIELD_FILTERS,
    SECTIONS_MAP,
    useOnSubmitEdit,
} from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { PickWithFieldFilters } from '../../types/generated'
import { IndicatorGroup } from '../../types/models'
import IndicatorGroupFormFields from './form/IndicatorGroupFormFields'
import { validate } from './form/indicatorGroupSchema'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'name',
    'code',
    'description',
    'indicators[id,displayName]',
] as const

export type IndicatorGroupFormValues = PickWithFieldFilters<
    IndicatorGroup,
    typeof fieldFilters
>

export const Component = () => {
    const section = SECTIONS_MAP.indicatorGroup
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string
    const query = {
        resource: 'indicatorGroups',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const indicatorGroupQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<IndicatorGroupFormValues>,
    })

    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ section, modelId })}
            initialValues={indicatorGroupQuery.data}
            validate={validate}
        >
            <DefaultEditFormContents section={section}>
                <IndicatorGroupFormFields />
            </DefaultEditFormContents>
        </FormBase>
    )
}
