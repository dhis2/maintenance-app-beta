/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type FileResource = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    contentLength: number
    contentMd5: string
    contentType: string
    created: string
    createdBy: User
    displayName: string
    domain: FileResource.domain
    favorite: boolean
    favorites: Array<string>
    hasMultipleStorageFiles: boolean
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    sharing: Sharing
    storageStatus: FileResource.storageStatus
    translations: Array<Translation>
    user: User
}

export namespace FileResource {
    export enum domain {
        DATA_VALUE = 'DATA_VALUE',
        PUSH_ANALYSIS = 'PUSH_ANALYSIS',
        DOCUMENT = 'DOCUMENT',
        MESSAGE_ATTACHMENT = 'MESSAGE_ATTACHMENT',
        USER_AVATAR = 'USER_AVATAR',
        ORG_UNIT = 'ORG_UNIT',
        CUSTOM_ICON = 'CUSTOM_ICON',
    }

    export enum storageStatus {
        NONE = 'NONE',
        PENDING = 'PENDING',
        FAILED = 'FAILED',
        STORED = 'STORED',
    }
}
