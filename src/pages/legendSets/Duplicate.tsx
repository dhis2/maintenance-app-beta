import { useQuery } from '@tanstack/react-query'
import { omit } from 'lodash'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { FormBase } from '../../components'
import { DefaultDuplicateFormContents } from '../../components/form/DefaultFormContents'
import {
    DEFAULT_FIELD_FILTERS,
    ATTRIBUTE_VALUES_FIELD_FILTERS,
    SECTIONS_MAP,
    useOnSubmitNew,
} from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { LegendSet, PickWithFieldFilters } from '../../types/generated'
import { LegendSetFormFields } from './form/LegendSetFormFields'
import { validate } from './form/legendSetSchema'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'name',
    'code',
    'legends[id,name,startValue,endValue,color,legendSet[id]]',
] as const

type LegendSetFormValues = PickWithFieldFilters<LegendSet, typeof fieldFilters>

const section = SECTIONS_MAP.legendSet

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const [searchParams] = useSearchParams()
    const duplicatedModelId = searchParams.get('duplicatedId') as string

    const query = {
        resource: 'legendSets',
        id: duplicatedModelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const legendSetQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<LegendSetFormValues>,
    })

    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={omit(legendSetQuery.data, 'id')}
            validate={validate}
            fetchError={!!legendSetQuery.error}
        >
            <DefaultDuplicateFormContents section={section}>
                <LegendSetFormFields />
            </DefaultDuplicateFormContents>
        </FormBase>
    )
}
