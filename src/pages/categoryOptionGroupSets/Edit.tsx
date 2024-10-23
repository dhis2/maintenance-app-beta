import React from 'react'
import { useQuery } from 'react-query'
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
import { CategoryOptionGroupSet } from '../../types/models'
import CategoryOptionGroupSetFormFields from './form/CategoryOptionGroupSetFormFields'
import { validate } from './form/categoryOptionGroupSetSchema'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'name',
    'shortName',
    'code',
    'description',
    'categoryOptions[id,displayName]',
    'dataDimension',
    'dataDimensionType',
] as const

export type CategoryOptionGroupSetFormValues = PickWithFieldFilters<
    CategoryOptionGroupSet,
    typeof fieldFilters
>

export const Component = () => {
    const section = SECTIONS_MAP.categoryOptionGroupSet
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string
    const query = {
        resource: 'categoryOptionGroupSets',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const categoryOptionGroupSetQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<CategoryOptionGroupSetFormValues>,
    })

    // console.log(categoryOptionGroupSetQuery, section)

    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ section, modelId })}
            section={section}
            initialValues={categoryOptionGroupSetQuery.data}
            validate={validate}
        >
            <DefaultEditFormContents section={section}>
                <CategoryOptionGroupSetFormFields />
            </DefaultEditFormContents>
        </FormBase>
    )
}
