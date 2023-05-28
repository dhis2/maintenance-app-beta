/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { OrganisationUnit } from './OrganisationUnit'
import type { Ref_Program_Enrollment } from './Ref_Program_Enrollment'
import type { TrackedEntityType } from './TrackedEntityType'
import type { User } from './User'
import type { Relationship_RelationshipItem } from './Relationship_RelationshipItem'
import type { Sharing } from './Sharing'
import type { TrackedEntityAttributeValue } from './TrackedEntityAttributeValue'
import type { TrackedEntityProgramOwner } from './TrackedEntityProgramOwner'
import type { Translation } from './Translation'
import type { UserInfoSnapshot } from './UserInfoSnapshot'

export type TrackedEntity = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdAtClient: string
    createdBy: User
    createdByUserInfo: UserInfoSnapshot
    deleted: boolean
    displayName: string
    enrollments: Array<Ref_Program_Enrollment>
    favorite: boolean
    favorites: Array<string>
    geometry: Record<string, any>
    href: string
    id: string
    inactive: boolean
    lastUpdated: string
    lastUpdatedAtClient: string
    lastUpdatedBy: User
    lastUpdatedByUserInfo: UserInfoSnapshot
    name: string
    organisationUnit: OrganisationUnit
    potentialDuplicate: boolean
    programOwners: Array<TrackedEntityProgramOwner>
    relationshipItems: Array<Relationship_RelationshipItem>
    sharing: Sharing
    storedBy: string
    trackedEntityAttributeValues: Array<TrackedEntityAttributeValue>
    trackedEntityType: TrackedEntityType
    translations: Array<Translation>
    user: User
}
