/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FilterPeriod } from './FilterPeriod'

export type Trackedentityfilter_EventFilter = {
    assignedUserMode: Trackedentityfilter_EventFilter.assignedUserMode
    assignedUsers: Array<string>
    eventCreatedPeriod: FilterPeriod
    eventStatus: Trackedentityfilter_EventFilter.eventStatus
    programStage: string
}

export namespace Trackedentityfilter_EventFilter {
    export enum assignedUserMode {
        CURRENT = 'CURRENT',
        PROVIDED = 'PROVIDED',
        NONE = 'NONE',
        ANY = 'ANY',
        ALL = 'ALL',
    }

    export enum eventStatus {
        ACTIVE = 'ACTIVE',
        COMPLETED = 'COMPLETED',
        VISITED = 'VISITED',
        SCHEDULE = 'SCHEDULE',
        OVERDUE = 'OVERDUE',
        SKIPPED = 'SKIPPED',
    }
}
