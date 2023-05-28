/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AttributeValueFilter } from './AttributeValueFilter'
import type { DateFilterPeriod } from './DateFilterPeriod'

export type EntityQueryCriteria = {
    assignedUserMode: EntityQueryCriteria.assignedUserMode
    assignedUsers: Array<string>
    attributeValueFilters: Array<AttributeValueFilter>
    displayColumnOrder: Array<string>
    enrollmentCreatedDate: DateFilterPeriod
    enrollmentIncidentDate: DateFilterPeriod
    enrollmentStatus: EntityQueryCriteria.enrollmentStatus
    eventDate: DateFilterPeriod
    eventStatus: EntityQueryCriteria.eventStatus
    followUp: boolean
    lastUpdatedDate: DateFilterPeriod
    order: string
    organisationUnit: string
    ouMode: EntityQueryCriteria.ouMode
    programStage: string
    trackedEntityInstances: Array<string>
    trackedEntityType: string
}

export namespace EntityQueryCriteria {
    export enum assignedUserMode {
        CURRENT = 'CURRENT',
        PROVIDED = 'PROVIDED',
        NONE = 'NONE',
        ANY = 'ANY',
        ALL = 'ALL',
    }

    export enum enrollmentStatus {
        ACTIVE = 'ACTIVE',
        COMPLETED = 'COMPLETED',
        CANCELLED = 'CANCELLED',
    }

    export enum eventStatus {
        ACTIVE = 'ACTIVE',
        COMPLETED = 'COMPLETED',
        VISITED = 'VISITED',
        SCHEDULE = 'SCHEDULE',
        OVERDUE = 'OVERDUE',
        SKIPPED = 'SKIPPED',
    }

    export enum ouMode {
        SELECTED = 'SELECTED',
        CHILDREN = 'CHILDREN',
        DESCENDANTS = 'DESCENDANTS',
        ACCESSIBLE = 'ACCESSIBLE',
        CAPTURE = 'CAPTURE',
        ALL = 'ALL',
    }
}
