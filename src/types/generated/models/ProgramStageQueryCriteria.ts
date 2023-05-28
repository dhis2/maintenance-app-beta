/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AttributeValueFilter } from './AttributeValueFilter'
import type { DateFilterPeriod } from './DateFilterPeriod'
import type { EventDataFilter } from './EventDataFilter'

export type ProgramStageQueryCriteria = {
    assignedUserMode: ProgramStageQueryCriteria.assignedUserMode
    assignedUsers: Array<string>
    attributeValueFilters: Array<AttributeValueFilter>
    dataFilters: Array<EventDataFilter>
    displayColumnOrder: Array<string>
    enrolledAt: DateFilterPeriod
    enrollmentOccurredAt: DateFilterPeriod
    enrollmentStatus: ProgramStageQueryCriteria.enrollmentStatus
    eventCreatedAt: DateFilterPeriod
    eventOccurredAt: DateFilterPeriod
    eventScheduledAt: DateFilterPeriod
    eventStatus: ProgramStageQueryCriteria.eventStatus
    order: string
    orgUnit: string
    ouMode: ProgramStageQueryCriteria.ouMode
}

export namespace ProgramStageQueryCriteria {
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
