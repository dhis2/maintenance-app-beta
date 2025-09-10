import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import { DefaultEditFormContents, FormBase } from '../../components'
import { SECTIONS_MAP, useOnSubmitEdit } from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import ConstantFormFields from './form/ConstantFormFields'
import { ConstantFormValues, validate } from './form/ConstantFormSchema'
import { fieldFilters } from './form/fieldFilters'

export const Component = () => {
    const modelId = useParams().id as string
    const section = SECTIONS_MAP.constant
    const queryFn = useBoundResourceQueryFn()

    const query = {
        resource: 'constants',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }

    const constantQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<ConstantFormValues>,
    })
    const initialValues = constantQuery.data

    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ section, modelId })}
            initialValues={initialValues}
            validate={validate}
        >
            <DefaultEditFormContents section={section}>
                <ConstantFormFields />
            </DefaultEditFormContents>
        </FormBase>
    )
}
