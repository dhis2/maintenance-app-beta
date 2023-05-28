/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { User } from './User'
import type { RelationshipConstraint } from './RelationshipConstraint'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type RelationshipType = {
    access: Access
    attributeValues: Array<AttributeValue>
    bidirectional: boolean
    code: string
    created: string
    createdBy: User
    description: string
    displayFromToName: string
    displayName: string
    displayToFromName: string
    favorite: boolean
    favorites: Array<string>
    fromConstraint: RelationshipConstraint
    fromToName: string
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    referral: boolean
    sharing: Sharing
    toConstraint: RelationshipConstraint
    toFromName: string
    translations: Array<Translation>
    user: User
}
