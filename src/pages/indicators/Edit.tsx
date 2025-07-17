import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import { DefaultEditFormContents, FormBase } from '../../components'
import { DEFAULT_FIELD_FILTERS, SECTIONS_MAP, useOnSubmitEdit } from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { Indicator, PickWithFieldFilters } from '../../types/generated'
import { IndicatiorFormFields } from './form/indicatorFormFields'
import { validate } from './form/IndicatorSchema'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
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
    'attributeValues[value,attribute[id]]',
] as const

export type IndicatorFormValues = PickWithFieldFilters<
    Indicator,
    typeof fieldFilters
> & { id: string }

export const Component = () => {
    const section = SECTIONS_MAP.indicator
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string
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
    const initialValues = indicatorQuery.data
    return (
        <FormBase
            onSubmit={useOnSubmitEdit({
                modelId: modelId as string,
                section: SECTIONS_MAP.indicator,
            })}
            initialValues={{ ...initialValues, url: 'https://www.google.com/' }}
            validate={validate}
            includeAttributes={false}
        >
            <DefaultEditFormContents section={section}>
                <IndicatiorFormFields />
            </DefaultEditFormContents>
        </FormBase>
    )
}
