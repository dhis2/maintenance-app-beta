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
    OrganisationUnitGroup,
    PickWithFieldFilters,
} from '../../types/generated'
import { validate } from './form'
import { OrganisationalUnitGroupFormFields } from './form/OrganisationalUnitGroupFormFields'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'name',
    'shortName',
    'code',
    'description',
    'compulsory',
    'color',
    'symbol',
    'organisationUnits[id,displayName,path]',
] as const

export type OrganisationUnitGroupFormValues = PickWithFieldFilters<
    OrganisationUnitGroup,
    typeof fieldFilters
>

const section = SECTIONS_MAP.organisationUnitGroup

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const [searchParams] = useSearchParams()
    const duplicatedModelId = searchParams.get('duplicatedId') as string

    const query = {
        resource: 'organisationUnitGroups',
        id: duplicatedModelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const organisationUnitGroupQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<OrganisationUnitGroupFormValues>,
    })

    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={omit(organisationUnitGroupQuery.data, 'id')}
            validate={validate}
            fetchError={!!organisationUnitGroupQuery.error}
        >
            <DefaultDuplicateFormContents section={section}>
                <OrganisationalUnitGroupFormFields />
            </DefaultDuplicateFormContents>
        </FormBase>
    )
}
