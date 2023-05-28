/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { CategoryOptionGroupSet } from './CategoryOptionGroupSet'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type DataApprovalLevel = {
    access: Access
    attributeValues: Array<AttributeValue>
    categoryOptionGroupSet: CategoryOptionGroupSet
    code: string
    created: string
    createdBy: User
    displayName: string
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    level: number
    name: string
    orgUnitLevel: number
    orgUnitLevelName: string
    sharing: Sharing
    translations: Array<Translation>
    user: User
}
