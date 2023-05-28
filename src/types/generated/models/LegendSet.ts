/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { Legend } from './Legend'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type LegendSet = {
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
    lastUpdated: string
    lastUpdatedBy: User
    legends: Array<Legend>
    name: string
    sharing: Sharing
    symbolizer: string
    translations: Array<Translation>
    user: User
}
