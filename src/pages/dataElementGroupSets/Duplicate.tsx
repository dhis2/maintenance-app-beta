import { useQuery } from '@tanstack/react-query'
import { omit } from 'lodash'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { FormBase } from '../../components'
import { DefaultDuplicateFormContents } from '../../components/form/DefaultFormContents'
import {
    ATTRIBUTE_VALUES_FIELD_FILTERS,
    SECTIONS_MAP,
    useBoundResourceQueryFn,
    useOnSubmitNew,
} from '../../lib'
import {
    DataElementGroupSet,
    PickWithFieldFilters,
} from '../../types/generated'
import { DataElementGroupSetFormFields, validate } from './form'

const fieldFilters = [
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
    const [searchParams] = useSearchParams()
    const duplicatedModelId = searchParams.get('duplicatedId') as string

    const query = {
        resource: 'dataElementGroupSets',
        id: duplicatedModelId,
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
            onSubmit={useOnSubmitNew({ section })}
            initialValues={omit(dataElementGroupSet.data, 'id')}
            validate={validate}
            fetchError={!!dataElementGroupSet.error}
        >
            <DefaultDuplicateFormContents section={section}>
                <DataElementGroupSetFormFields />
            </DefaultDuplicateFormContents>
        </FormBase>
    )
}
