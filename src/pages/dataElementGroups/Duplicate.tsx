import { useQuery } from '@tanstack/react-query'
import { omit } from 'lodash'
import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FormBase } from '../../components'
import { DefaultDuplicateFormContents } from '../../components/form/DefaultFormContents'
import {
    ATTRIBUTE_VALUES_FIELD_FILTERS,
    SECTIONS_MAP,
    useBoundResourceQueryFn,
    useOnSubmitNew,
} from '../../lib'
import { DataElementGroup, PickWithFieldFilters } from '../../types/generated'
import { DataElementGroupFormFields, validate } from './form'

const fieldFilters = [
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
    const [searchParams] = useSearchParams()
    const duplicatedModelId = searchParams.get('duplicatedId') as string

    const query = {
        resource: 'dataElementGroups',
        id: duplicatedModelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const dataElementGroup = useQuery({
        queryKey: [query],
        queryFn: queryFn<DataElementGroupFormValues>,
    })

    const onSubmit = useOnSubmitNew<Omit<DataElementGroupFormValues, 'id'>>({
        section,
    })

    const initialValues = useMemo(() => {
        return dataElementGroup.data
            ? omit(dataElementGroup.data, 'id')
            : undefined
    }, [dataElementGroup.data])

    return (
        <FormBase
            onSubmit={onSubmit}
            initialValues={initialValues}
            validate={validate}
            fetchError={!!dataElementGroup.error}
        >
            <DefaultDuplicateFormContents section={section}>
                <DataElementGroupFormFields />
            </DefaultDuplicateFormContents>
        </FormBase>
    )
}
