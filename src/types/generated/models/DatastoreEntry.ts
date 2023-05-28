/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type DatastoreEntry = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    displayName: string
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    key: string
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    namespace: string
    sharing: Sharing
    translations: Array<Translation>
    user: User
    value: string
}
