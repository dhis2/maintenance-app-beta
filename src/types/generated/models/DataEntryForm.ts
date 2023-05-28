/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type DataEntryForm = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    displayName: string
    favorite: boolean
    favorites: Array<string>
    format: number
    href: string
    htmlCode: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    sharing: Sharing
    style: DataEntryForm.style
    translations: Array<Translation>
    user: User
}

export namespace DataEntryForm {
    export enum style {
        COMFORTABLE = 'COMFORTABLE',
        NORMAL = 'NORMAL',
        COMPACT = 'COMPACT',
        NONE = 'NONE',
    }
}
