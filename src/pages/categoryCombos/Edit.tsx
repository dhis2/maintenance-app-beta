import React from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { DefaultEditFormContents, FormBase } from '../../components'
import { DEFAULT_FIELD_FILTERS, SECTIONS_MAP, useOnSubmitEdit } from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { CategoryCombo, PickWithFieldFilters } from '../../types/generated'
import { validate, CategoryComboFormFields } from './form'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    'code',
    'categories[id,displayName]',
    'skipTotal',
    'dataDimensionType',
] as const

export type CategoryComboFormValues = PickWithFieldFilters<
    CategoryCombo,
    typeof fieldFilters
>

export const Component = () => {
    const section = SECTIONS_MAP.category
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string
    const query = {
        resource: 'categoryCombos',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const categoryCombo = useQuery({
        queryKey: [query],
        queryFn: queryFn<CategoryComboFormValues>,
    })

    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ section, modelId })}
            section={section}
            initialValues={categoryCombo.data}
            validate={validate}
        >
            <DefaultEditFormContents section={section}>
                <CategoryComboFormFields />
            </DefaultEditFormContents>
        </FormBase>
    )
}
