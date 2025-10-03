import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import { DefaultEditFormContents, FormBase } from '../../components'
import { DEFAULT_FIELD_FILTERS, SECTIONS_MAP, useOnSubmitEdit } from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import {
    PickWithFieldFilters,
    ValidationRuleGroup,
} from '../../types/generated'
import ValidationRuleGroupsFormFields from './form/ValidationRuleGroupsFormFields'
import { validate } from './form/validationRuleGroupsSchema'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    'code',
    'description',
    'validationRules[id,displayName]',
] as const

export type ValidationRuleGroupFormValues = PickWithFieldFilters<
    ValidationRuleGroup,
    typeof fieldFilters
> & { id: string }

export const Component = () => {
    const modelId = useParams().id as string
    const section = SECTIONS_MAP.validationRuleGroup
    const queryFn = useBoundResourceQueryFn()

    const query = {
        resource: 'validationRuleGroups',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }

    const validationRuleGroupQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<ValidationRuleGroupFormValues>,
    })
    const initialValues = validationRuleGroupQuery.data

    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ section, modelId })}
            initialValues={initialValues}
            validate={validate}
            includeAttributes={false}
        >
            <DefaultEditFormContents section={section}>
                <ValidationRuleGroupsFormFields />
            </DefaultEditFormContents>
        </FormBase>
    )
}
