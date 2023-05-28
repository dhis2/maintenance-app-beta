/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { QueryModifiers } from './QueryModifiers'
import type { CategoryOptionCombo } from './CategoryOptionCombo'
import type { DataElement } from './DataElement'
import type { LegendSet } from './LegendSet'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type DataElementOperand = {
    access: Access
    attributeOptionCombo: CategoryOptionCombo
    attributeValues: Array<AttributeValue>
    categoryOptionCombo: CategoryOptionCombo
    code: string
    created: string
    createdBy: User
    dataElement: DataElement
    description: string
    displayDescription: string
    displayFormName: string
    favorite: boolean
    favorites: Array<string>
    formName: string
    href: string
    lastUpdated: string
    lastUpdatedBy: User
    legendSet: LegendSet
    legendSets: Array<LegendSet>
    queryMods: QueryModifiers
    sharing: Sharing
    translations: Array<Translation>
    user: User
}
