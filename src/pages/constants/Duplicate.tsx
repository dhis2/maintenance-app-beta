import { useQuery } from '@tanstack/react-query'
import { omit } from 'lodash'
import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FormBase } from '../../components'
import { DefaultDuplicateFormContents } from '../../components/form/DefaultFormContents'
import { SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import ConstantFormFields from './form/ConstantFormFields'
import { ConstantFormValues, validate } from './form/ConstantFormSchema'
import { fieldFilters } from './form/fieldFilters'

const section = SECTIONS_MAP.constant

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const [searchParams] = useSearchParams()
    const duplicatedModelId = searchParams.get('duplicatedId') as string

    const query = {
        resource: 'constants',
        id: duplicatedModelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const constantQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<ConstantFormValues>,
    })

    const onSubmit = useOnSubmitNew<Omit<ConstantFormValues, 'id'>>({
        section,
    })

    const initialValues = useMemo(
        () => (constantQuery.data ? omit(constantQuery.data, 'id') : undefined),
        [constantQuery.data]
    )

    return (
        <FormBase
            onSubmit={onSubmit}
            initialValues={initialValues}
            validate={validate}
            fetchError={!!constantQuery.error}
        >
            <DefaultDuplicateFormContents section={section}>
                <ConstantFormFields />
            </DefaultDuplicateFormContents>
        </FormBase>
    )
}
