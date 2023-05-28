/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { QueryModifiers } from './QueryModifiers'
import type { LegendSet } from './LegendSet'
import type { Program } from './Program'
import type { TrackedEntityAttribute } from './TrackedEntityAttribute'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type ProgramTrackedEntityAttributeDimensionItem = {
    access: Access
    attribute: TrackedEntityAttribute
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    description: string
    displayDescription: string
    displayFormName: string
    favorite: boolean
    favorites: Array<string>
    formName: string
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    legendSet: LegendSet
    program: Program
    queryMods: QueryModifiers
    sharing: Sharing
    shortName: string
    translations: Array<Translation>
    user: User
}
