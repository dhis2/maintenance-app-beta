/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { IndicatorGroup } from './IndicatorGroup'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type IndicatorGroupSet = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    compulsory: boolean
    created: string
    createdBy: User
    description: string
    displayName: string
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    indicatorGroups: Array<IndicatorGroup>
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    sharing: Sharing
    shortName: string
    translations: Array<Translation>
    user: User
}
