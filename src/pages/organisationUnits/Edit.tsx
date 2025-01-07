import React from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { DefaultEditFormContents, FormBase } from '../../components'
import {
    ATTRIBUTE_VALUES_FIELD_FILTERS,
    DEFAULT_FIELD_FILTERS,
    SECTIONS_MAP,
    useOnSubmitEdit,
} from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { OrganisationUnit, PickWithFieldFilters } from '../../types/generated'
import {
    OrganisationUnitFormField,
    organisationUnitSchema,
    validate,
} from './form'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'name',
    'code',
    'shortName',
    'openingDate',
    'closedDate',
    'comment',
    'image[id,name]',
    'description',
    'contactPerson',
    'address',
    'email',
    'phoneNumber',
    'url',
    'geometry',
    'dataSets',
    'programs',
    'level',
    'path',
    'parent[id,path, displayName]',
] as const

export type OrgUnitFormValues = PickWithFieldFilters<
    OrganisationUnit,
    typeof fieldFilters
>

const section = SECTIONS_MAP.organisationUnit

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string

    const query = {
        resource: 'organisationUnits',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const orgUnit = useQuery({
        queryKey: [query],
        queryFn: queryFn<OrgUnitFormValues>,
    })

    return (
        <FormBase
            onSubmit={useOnSubmitEdit({
                section,
                modelId,
            })}
            initialValues={orgUnit.data}
            validate={validate}
        >
            <DefaultEditFormContents section={section}>
                <OrganisationUnitFormField />
            </DefaultEditFormContents>
        </FormBase>
    )
}
