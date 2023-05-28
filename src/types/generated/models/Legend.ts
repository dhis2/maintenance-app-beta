/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type Legend = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    color: string
    created: string
    createdBy: User
    displayName: string
    endValue: number
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    image: string
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    sharing: Sharing
    startValue: number
    translations: Array<Translation>
    user: User
}
