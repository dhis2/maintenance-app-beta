/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DateFilterPeriod } from './DateFilterPeriod'
import type { EventDataFilter } from './EventDataFilter'

export type EventQueryCriteria = {
    assignedUserMode: EventQueryCriteria.assignedUserMode
    assignedUsers: Array<string>
    completedDate: DateFilterPeriod
    dataFilters: Array<EventDataFilter>
    displayColumnOrder: Array<string>
    dueDate: DateFilterPeriod
    eventDate: DateFilterPeriod
    events: Array<string>
    followUp: boolean
    lastUpdatedDate: DateFilterPeriod
    order: string
    organisationUnit: string
    ouMode: EventQueryCriteria.ouMode
    status: EventQueryCriteria.status
}

export namespace EventQueryCriteria {
    export enum assignedUserMode {
        CURRENT = 'CURRENT',
        PROVIDED = 'PROVIDED',
        NONE = 'NONE',
        ANY = 'ANY',
        ALL = 'ALL',
    }

    export enum ouMode {
        SELECTED = 'SELECTED',
        CHILDREN = 'CHILDREN',
        DESCENDANTS = 'DESCENDANTS',
        ACCESSIBLE = 'ACCESSIBLE',
        CAPTURE = 'CAPTURE',
        ALL = 'ALL',
    }

    export enum status {
        ACTIVE = 'ACTIVE',
        COMPLETED = 'COMPLETED',
        VISITED = 'VISITED',
        SCHEDULE = 'SCHEDULE',
        OVERDUE = 'OVERDUE',
        SKIPPED = 'SKIPPED',
    }
}
