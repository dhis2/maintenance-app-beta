/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { IpAllowedList } from './IpAllowedList'
import type { MethodAllowedList } from './MethodAllowedList'
import type { User } from './User'
import type { RefererAllowedList } from './RefererAllowedList'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type ApiToken = {
    access: Access
    attributeValues: Array<AttributeValue>
    attributes: Array<IpAllowedList | RefererAllowedList | MethodAllowedList>
    code: string
    created: string
    createdBy: User
    displayName: string
    expire: number
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    sharing: Sharing
    translations: Array<Translation>
    type: ApiToken.type
    user: User
    version: number
}

export namespace ApiToken {
    export enum type {
        PERSONAL_ACCESS_TOKEN_V1 = 'PERSONAL_ACCESS_TOKEN_V1',
    }
}
