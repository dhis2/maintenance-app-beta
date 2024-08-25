import React from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { DefaultEditFormContents, FormBase } from '../../components'
import { DEFAULT_FIELD_FILTERS, SECTIONS_MAP, useOnSubmitEdit } from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { PickWithFieldFilters } from '../../types/generated'
import { Category } from '../../types/models'
import { validate } from './form'
import { CategoryFormFields } from './form/CategoryFormFields'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    'shortName',
    'code',
    'description',
    'categoryCombos',
    'categoryOptions[id,displayName]',
    'dataDimension',
    'dataDimensionType',
    'attributeValues[value,attribute[id]]',
] as const

export type CategoryFormValues = PickWithFieldFilters<
    Category,
    typeof fieldFilters
>

export const Component = () => {
    const section = SECTIONS_MAP.category
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string
    const query = {
        resource: 'categories',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const categoryQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<CategoryFormValues>,
    })

    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ section, modelId })}
            section={section}
            initialValues={categoryQuery.data}
            validate={validate}
        >
            <DefaultEditFormContents section={section}>
                <CategoryFormFields />
            </DefaultEditFormContents>
        </FormBase>
    )
}
