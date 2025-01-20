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
import { CategoryOptionGroup } from '../../types/models'
import CategoryOptionGroupFormFields from './form/CategoryOptionGroupFormFields'
import { validate } from './form/categoryOptionGroupSchema'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'name',
    'shortName',
    'code',
    'description',
    'categoryOptions[id,displayName]',
    'dataDimensionType',
] as const

export type CategoryOptionGroupFormValues = PickWithFieldFilters<
    CategoryOptionGroup,
    typeof fieldFilters
>

export const Component = () => {
    const section = SECTIONS_MAP.categoryOptionGroup
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string
    const query = {
        resource: 'categoryOptionGroups',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const categoryOptionGroupQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<CategoryOptionGroupFormValues>,
    })

    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ section, modelId })}
            initialValues={categoryOptionGroupQuery.data}
            validate={validate}
        >
            <DefaultEditFormContents section={section}>
                <CategoryOptionGroupFormFields />
            </DefaultEditFormContents>
        </FormBase>
    )
}
