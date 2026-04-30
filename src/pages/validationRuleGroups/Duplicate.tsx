import { useQuery } from '@tanstack/react-query'
import { omit } from 'lodash'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { FormBase } from '../../components'
import { DefaultDuplicateFormContents } from '../../components/form/DefaultFormContents'
import {
    ATTRIBUTE_VALUES_FIELD_FILTERS,
    DEFAULT_FIELD_FILTERS,
    SECTIONS_MAP,
    useOnSubmitNew,
} from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import {
    PickWithFieldFilters,
    ValidationRuleGroup,
} from '../../types/generated'
import { ValidationRuleGroupsFormFields } from './form/ValidationRuleGroupsFormFields'
import { validate } from './form/validationRuleGroupsSchema'

const fieldFilters = [
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
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

const section = SECTIONS_MAP.validationRuleGroup

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const [searchParams] = useSearchParams()
    const duplicatedModelId = searchParams.get('duplicatedId') as string

    const query = {
        resource: 'validationRuleGroups',
        id: duplicatedModelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const validationRuleGroupQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<ValidationRuleGroupFormValues>,
    })

    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={omit(validationRuleGroupQuery.data, 'id')}
            validate={validate}
            fetchError={!!validationRuleGroupQuery.error}
        >
            <DefaultDuplicateFormContents section={section}>
                <ValidationRuleGroupsFormFields />
            </DefaultDuplicateFormContents>
        </FormBase>
    )
}
