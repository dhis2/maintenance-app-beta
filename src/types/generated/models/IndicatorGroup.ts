/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { Indicator } from './Indicator'
import type { IndicatorGroupSet } from './IndicatorGroupSet'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type IndicatorGroup = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    description: string
    displayName: string
    favorite: boolean
    favorites: Array<string>
    groupSets: Array<IndicatorGroupSet>
    href: string
    id: string
    indicatorGroupSet: IndicatorGroupSet
    indicators: Array<Indicator>
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    sharing: Sharing
    translations: Array<Translation>
    user: User
}
