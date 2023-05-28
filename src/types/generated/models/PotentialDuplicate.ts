/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type PotentialDuplicate = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    createdByUserName: string
    displayName: string
    duplicate: string
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    lastUpdatedByUserName: string
    name: string
    original: string
    sharing: Sharing
    status: PotentialDuplicate.status
    translations: Array<Translation>
    user: User
}

export namespace PotentialDuplicate {
    export enum status {
        ALL = 'ALL',
        OPEN = 'OPEN',
        INVALID = 'INVALID',
        MERGED = 'MERGED',
    }
}
