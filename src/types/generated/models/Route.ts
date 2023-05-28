/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { ApiTokenAuth } from './ApiTokenAuth'
import type { AttributeValue } from './AttributeValue'
import type { HttpBasicAuth } from './HttpBasicAuth'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type Route = {
    access: Access
    attributeValues: Array<AttributeValue>
    auth: HttpBasicAuth | ApiTokenAuth
    authorities: Array<string>
    code: string
    created: string
    createdBy: User
    description: string
    disabled: boolean
    displayName: string
    favorite: boolean
    favorites: Array<string>
    headers: Record<string, string>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    sharing: Sharing
    translations: Array<Translation>
    url: string
    user: User
}
