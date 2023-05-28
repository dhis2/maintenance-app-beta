/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type MetadataVersion = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    displayName: string
    favorite: boolean
    favorites: Array<string>
    hashCode: string
    href: string
    id: string
    importDate: string
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    sharing: Sharing
    translations: Array<Translation>
    type: MetadataVersion.type
    user: User
}

export namespace MetadataVersion {
    export enum type {
        BEST_EFFORT = 'BEST_EFFORT',
        ATOMIC = 'ATOMIC',
    }
}
