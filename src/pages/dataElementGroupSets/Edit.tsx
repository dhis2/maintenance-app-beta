import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import { DefaultEditFormContents, FormBase } from '../../components'
import {
    ATTRIBUTE_VALUES_FIELD_FILTERS,
    DEFAULT_FIELD_FILTERS,
    SECTIONS_MAP,
    useBoundResourceQueryFn,
    useOnSubmitEdit,
} from '../../lib'
import {
    DataElementGroupSet,
    PickWithFieldFilters,
} from '../../types/generated'
import { DataElementGroupSetFormFields, validate } from './form'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'name',
    'shortName',
    'code',
    'description',
    'compulsory',
    'dataDimension',
    'dataElementGroups[id,displayName]',
] as const

export type DataElementGroupSetFormValues = PickWithFieldFilters<
    DataElementGroupSet,
    typeof fieldFilters
> & { id: string }

export const Component = () => {
    const section = SECTIONS_MAP.dataElementGroupSet
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string

    const query = {
        resource: 'dataElementGroupSets',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const dataElementGroupSet = useQuery({
        queryKey: [query],
        queryFn: queryFn<DataElementGroupSetFormValues>,
    })

    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ modelId, section })}
            initialValues={dataElementGroupSet.data}
            validate={validate}
        >
            <DefaultEditFormContents section={section}>
                <DataElementGroupSetFormFields />
            </DefaultEditFormContents>
        </FormBase>
    )
}
