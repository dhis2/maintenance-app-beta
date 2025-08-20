import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import { DefaultEditFormContents, FormBase } from '../../components'
import { SECTIONS_MAP, useOnSubmitEdit } from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { fieldFilters } from './form/fieldFilters'
import { OptionGroupFormFields } from './form/OptionGroupFormFields'
import { OptionGroupFormValues, validate } from './form/OptionGroupFormSchema'

export const Component = () => {
    const modelId = useParams().id as string
    const section = SECTIONS_MAP.optionGroup
    const queryFn = useBoundResourceQueryFn()

    const query = {
        resource: 'optionGroups',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }

    const optionGroupQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<OptionGroupFormValues>,
    })
    const initialValues = optionGroupQuery.data

    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ section, modelId })}
            initialValues={initialValues}
            validate={validate}
            includeAttributes={false}
        >
            <DefaultEditFormContents section={section}>
                <OptionGroupFormFields />
            </DefaultEditFormContents>
        </FormBase>
    )
}
