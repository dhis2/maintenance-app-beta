import { OrganisationUnit } from '../../../types/generated'

export type FormValues = Omit<OrganisationUnit, 'parent'> & {
    parent: { id: string }[]
}
