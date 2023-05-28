/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { EventQueryCriteria } from './EventQueryCriteria'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type EventFilter = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    description: string
    displayDescription: string
    displayName: string
    eventQueryCriteria: EventQueryCriteria
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    program: string
    programStage: string
    sharing: Sharing
    translations: Array<Translation>
    user: User
}
