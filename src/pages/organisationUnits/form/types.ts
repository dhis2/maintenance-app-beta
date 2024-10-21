import { OrganisationUnit } from '../../../types/generated'

export type FormValues = Omit<OrganisationUnit, 'parent'> & {
    // this is an array as teh orgunit selector operates on arrays
    parent: { id: string }[]
}
