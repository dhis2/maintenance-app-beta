import { useQuery } from '@tanstack/react-query'
import { omit } from 'lodash'
import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FormBase } from '../../components'
import { DefaultDuplicateFormContents } from '../../components/form/DefaultFormContents'
import {
    DEFAULT_FIELD_FILTERS,
    ATTRIBUTE_VALUES_FIELD_FILTERS,
    SECTIONS_MAP,
    useOnSubmitNew,
} from '../../lib'
import { generateDhis2Id } from '../../lib/models/uid'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { LegendSet, PickWithFieldFilters } from '../../types/generated'
import { LegendSetFormFields } from './form/LegendSetFormFields'
import { validate } from './form/legendSetSchema'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'name',
    'code',
    'legends[name,startValue,endValue,color,legendSet[id]]',
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

    const initialValues = useMemo(() => {
        const originalData = omit(legendSetQuery.data, 'id')
        return originalData.legends
            ? {
                  ...originalData,
                  legends: originalData.legends.map((legend) => ({
                      ...(legend as Record<string, unknown>),
                      id: generateDhis2Id(),
                  })),
              }
            : originalData
    }, [legendSetQuery.data])

    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
            fetchError={!!legendSetQuery.error}
        >
            <DefaultDuplicateFormContents section={section}>
                <LegendSetFormFields />
            </DefaultDuplicateFormContents>
        </FormBase>
    )
}
