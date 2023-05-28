/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type UserRole = {
    access: Access
    attributeValues: Array<AttributeValue>
    authorities: Array<string>
    code: string
    created: string
    createdBy: User
    description: string
    displayName: string
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    restrictions: Array<string>
    sharing: Sharing
    translations: Array<Translation>
    user: User
    users: Array<User>
}
