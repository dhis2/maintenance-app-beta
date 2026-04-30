import { useQuery } from '@tanstack/react-query'
import { omit } from 'lodash'
import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FormBase } from '../../components'
import { DefaultDuplicateFormContents } from '../../components/form/DefaultFormContents'
import { SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { fieldFilters } from './form/fieldFilters'
import { OptionGroupFormFields } from './form/OptionGroupFormFields'
import { OptionGroupFormValues, validate } from './form/OptionGroupFormSchema'

const section = SECTIONS_MAP.optionGroup

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const [searchParams] = useSearchParams()
    const duplicatedModelId = searchParams.get('duplicatedId') as string

    const query = {
        resource: 'optionGroups',
        id: duplicatedModelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const optionGroupQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<OptionGroupFormValues>,
    })

    const initialValues = useMemo(
        () => omit(optionGroupQuery.data, 'id'),
        [optionGroupQuery.data]
    )

    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
            fetchError={!!optionGroupQuery.error}
            includeAttributes={false}
        >
            <DefaultDuplicateFormContents section={section}>
                <OptionGroupFormFields />
            </DefaultDuplicateFormContents>
        </FormBase>
    )
}
