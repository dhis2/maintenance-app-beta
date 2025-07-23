import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import { DefaultEditFormContents, FormBase } from '../../components'
import {
    useOnSubmitEdit,
    useBoundResourceQueryFn,
    SECTIONS_MAP,
    DEFAULT_FIELD_FILTERS,
    ATTRIBUTE_VALUES_FIELD_FILTERS,
} from '../../lib'
import { DataElementGroup, PickWithFieldFilters } from '../../types/generated'
import { DataElementGroupFormFields, validate } from './form'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'name',
    'shortName',
    'code',
    'description',
    'dataElements[id,displayName]',
] as const

export type DataElementGroupFormValues = PickWithFieldFilters<
    DataElementGroup,
    typeof fieldFilters
> & { id: string }

export const Component = () => {
    const section = SECTIONS_MAP.dataElementGroup
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string

    const query = {
        resource: 'dataElementGroups',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const dataElementGroup = useQuery({
        queryKey: [query],
        queryFn: queryFn<DataElementGroupFormValues>,
    })

    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ modelId, section })}
            initialValues={dataElementGroup.data}
            validate={validate}
        >
            <DefaultEditFormContents section={section}>
                <DataElementGroupFormFields />
            </DefaultEditFormContents>
        </FormBase>
    )
}
