import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import { DefaultEditFormContents, FormBase } from '../../components'
import {
    ATTRIBUTE_VALUES_FIELD_FILTERS,
    DEFAULT_FIELD_FILTERS,
    SECTIONS_MAP,
    useOnSubmitEdit,
} from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import {
    OrganisationUnitGroupSet,
    PickWithFieldFilters,
} from '../../types/generated'
import { validate } from './form'
import { OrganisationalUnitGroupSetFormFields } from './form/OrganisationalUnitGroupSetFormFields'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'name',
    'shortName',
    'code',
    'description',
    'compulsory',
    'dataDimension',
    'includeSubhierarchyInAnalytics',
    'organisationUnitGroups[id,displayName]',
] as const

export type OrganisationUnitGroupSetFormValues = PickWithFieldFilters<
    OrganisationUnitGroupSet,
    typeof fieldFilters
>

export const Component = () => {
    const section = SECTIONS_MAP.organisationUnitGroupSet
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string
    const query = {
        resource: 'organisationUnitGroupSets',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const organisationUnitGroupSetQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<OrganisationUnitGroupSetFormValues>,
    })

    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ section, modelId })}
            initialValues={organisationUnitGroupSetQuery.data}
            validate={validate}
        >
            <DefaultEditFormContents section={section}>
                <OrganisationalUnitGroupSetFormFields />
            </DefaultEditFormContents>
        </FormBase>
    )
}
