/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { QueryModifiers } from './QueryModifiers'
import type { DataElement } from './DataElement'
import type { DataElementGroupSet } from './DataElementGroupSet'
import type { LegendSet } from './LegendSet'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type DataElementGroup = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    dataElements: Array<DataElement>
    description: string
    dimensionItem: string
    displayDescription: string
    displayFormName: string
    displayName: string
    displayShortName: string
    favorite: boolean
    favorites: Array<string>
    formName: string
    groupSets: Array<DataElementGroupSet>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    legendSet: LegendSet
    legendSets: Array<LegendSet>
    name: string
    queryMods: QueryModifiers
    sharing: Sharing
    shortName: string
    translations: Array<Translation>
    user: User
}
