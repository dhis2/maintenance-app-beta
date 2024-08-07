import React from 'react'
import { DefaultFields } from '../../lib/'
import { ModelCollectionResponse, OrganisationUnit } from '../../types/models'
import { OrganisationUnitList } from './list/OrganisationUnitList'

type FilteredOrganisationUnits = Pick<OrganisationUnit, DefaultFields> &
    Partial<OrganisationUnit>

type OrganisationUnits = ModelCollectionResponse<
    FilteredOrganisationUnits,
    'organisationUnits'
>

export const Component = () => {
    return <OrganisationUnitList />
}
