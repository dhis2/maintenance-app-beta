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
import {
    CategoryOptionCombo,
    PickWithFieldFilters,
} from '../../types/generated'
import { validate, CategoryOptionComboFormFields } from './form'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'name',
    'code',
    'ignoreApproval',
] as const

export type CategoryOptionComboFormValues = PickWithFieldFilters<
    CategoryOptionCombo,
    typeof fieldFilters
>

const section = SECTIONS_MAP.categoryOptionCombo

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string
    const query = {
        resource: 'categoryOptionCombos',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const categoryOptionCombo = useQuery({
        queryKey: [query],
        queryFn: queryFn<CategoryOptionComboFormValues>,
    })

    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ section, modelId })}
            initialValues={categoryOptionCombo.data}
            validate={validate}
        >
            <DefaultEditFormContents section={section}>
                <CategoryOptionComboFormFields />
            </DefaultEditFormContents>
        </FormBase>
    )
}
