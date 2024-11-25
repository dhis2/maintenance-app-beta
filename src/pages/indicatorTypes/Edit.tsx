import React from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import { FormBase } from '../../components/form/FormBase'
import { SECTIONS_MAP, useOnSubmitEdit } from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { IndicatorType, PickWithFieldFilters } from '../../types/models'
import { validate } from './form'
import { IndicatorTypesFormFields } from './form/IndicatorTypesFormFields'

const fieldFilters = ['name', 'factor'] as const

export type IndicatorTypesFormValues = PickWithFieldFilters<
    IndicatorType,
    typeof fieldFilters
> & { id: string }

export const Component = () => {
    const section = SECTIONS_MAP.indicatorType
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string

    const query = {
        resource: 'indicatorTypes',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const indicatorTypeQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<IndicatorTypesFormValues>,
    })
    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ section, modelId })}
            section={section}
            initialValues={indicatorTypeQuery.data}
            validate={validate}
            includeAttributes={false}
        >
            <DefaultNewFormContents section={section}>
                <IndicatorTypesFormFields />
            </DefaultNewFormContents>
        </FormBase>
    )
}
