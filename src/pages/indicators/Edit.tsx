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
import { Indicator, PickWithFieldFilters } from '../../types/generated'
import { IndicatiorFormFields } from './form/IndicatorFormFields'
import { validate } from './form/indicatorSchema'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'name',
    'shortName',
    'code',
    'description',
    'numerator',
    'numeratorDescription',
    'denominator',
    'indicatorType',
    'denominatorDescription',
    'annualized',
    'decimals',
    'url',
    'aggregateExportCategoryOptionCombo',
    'aggregateExportAttributeOptionCombo',
    'indicatorType[id]',
    'legendSets[id]',
    'style[color,icon]',
] as const

export type IndicatorFormValues = PickWithFieldFilters<
    Indicator,
    typeof fieldFilters
>

export const Component = () => {
    const modelId = useParams().id as string
    const section = SECTIONS_MAP.indicator
    const queryFn = useBoundResourceQueryFn()

    const query = {
        resource: 'indicators',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }

    const indicatorQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<IndicatorFormValues>,
    })

    const onSubmit = useOnSubmitEdit<IndicatorFormValues>({
        modelId,
        section,
    })

    const initialValues = indicatorQuery.data

    return (
        <FormBase
            onSubmit={onSubmit}
            initialValues={initialValues}
            validate={validate}
        >
            <DefaultEditFormContents section={section}>
                <IndicatiorFormFields />
            </DefaultEditFormContents>
        </FormBase>
    )
}
