/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { EntityQueryCriteria } from './EntityQueryCriteria'
import type { FilterPeriod } from './FilterPeriod'
import type { ObjectStyle } from './ObjectStyle'
import type { Program } from './Program'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Trackedentityfilter_EventFilter } from './Trackedentityfilter_EventFilter'
import type { Translation } from './Translation'

export type TrackedEntityFilter = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    description: string
    displayDescription: string
    displayName: string
    enrollmentCreatedPeriod: FilterPeriod
    enrollmentStatus: TrackedEntityFilter.enrollmentStatus
    entityQueryCriteria: EntityQueryCriteria
    eventFilters: Array<Trackedentityfilter_EventFilter>
    favorite: boolean
    favorites: Array<string>
    followup: boolean
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    program: Program
    sharing: Sharing
    sortOrder: number
    style: ObjectStyle
    translations: Array<Translation>
    user: User
}

export namespace TrackedEntityFilter {
    export enum enrollmentStatus {
        ACTIVE = 'ACTIVE',
        COMPLETED = 'COMPLETED',
        CANCELLED = 'CANCELLED',
    }
}
