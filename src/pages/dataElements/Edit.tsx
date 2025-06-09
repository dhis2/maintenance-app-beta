import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { FormBase } from '../../components'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import {
    SECTIONS_MAP,
    useBoundResourceQueryFn,
    useOnSubmitEdit,
} from '../../lib'
import { DataElement, PickWithFieldFilters } from '../../types/generated'
import {
    DataElementFormFields,
    dataElementValueFormatter,
    validate,
} from './form'

const fieldFilters = [
    '*',
    'categoryCombo[id,displayName]',
    'attributeValues[*]',
    'commentOptionSet[id,displayName]',
    'optionSet[id,displayName]',
] as const

export type DataElementFormValues = PickWithFieldFilters<
    DataElement,
    typeof fieldFilters
> & { id: string }

export const Component = () => {
    const section = SECTIONS_MAP.dataElement
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string

    const query = {
        resource: 'dataElements',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const dataElement = useQuery({
        queryKey: [query],
        queryFn: queryFn<DataElementFormValues>,
    })

    const initialValues = useMemo(
        () =>
            dataElement.data && {
                ...dataElement.data,
                categoryCombo: dataElement?.data?.categoryCombo.id
                    ? dataElement?.data?.categoryCombo
                    : { id: '' },
                commentOptionSet: dataElement?.data?.commentOptionSet?.id
                    ? dataElement?.data?.commentOptionSet
                    : { id: '' },
                optionSet: dataElement.data?.optionSet?.id
                    ? dataElement.data?.optionSet
                    : { id: '' },
            },
        [dataElement.data]
    )

    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ modelId, section })}
            initialValues={initialValues}
            validate={validate}
            valueFormatter={dataElementValueFormatter}
        >
            <DefaultNewFormContents section={section}>
                <DataElementFormFields />
            </DefaultNewFormContents>
        </FormBase>
    )
}
