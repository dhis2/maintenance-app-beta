import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import { FormBase } from '../../components/'
import { DefaultEditFormContents } from '../../components/form/DefaultFormContents'
import { DEFAULT_FIELD_FILTERS, SECTIONS_MAP, useOnSubmitEdit } from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { PickWithFieldFilters, ProgramIndicatorGroup } from '../../types/models'
import { validate } from './form'
import { ProgramIndicatorGroupsFormFields } from './form/ProgramIndicatorGroupsFormFields'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    'code',
    'programIndicators[id,displayName]',
] as const

export type ProgramIndicatorGroupsFormValues = PickWithFieldFilters<
    ProgramIndicatorGroup,
    typeof fieldFilters
> & { id: string }

export const Component = () => {
    const section = SECTIONS_MAP.programIndicatorGroup
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string

    const query = {
        resource: 'programIndicatorGroups',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const programIndicatorGroupsQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<ProgramIndicatorGroupsFormValues>,
    })
    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ section, modelId })}
            initialValues={programIndicatorGroupsQuery.data}
            validate={validate}
            includeAttributes={false}
        >
            <DefaultEditFormContents section={section}>
                <ProgramIndicatorGroupsFormFields />
            </DefaultEditFormContents>
        </FormBase>
    )
}
