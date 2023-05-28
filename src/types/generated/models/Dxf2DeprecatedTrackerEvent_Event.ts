/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Dxf2DeprecatedTrackerEvent_DataValue } from './Dxf2DeprecatedTrackerEvent_DataValue'
import type { Note } from './Note'
import type { Relationship } from './Relationship'
import type { UserInfoSnapshot } from './UserInfoSnapshot'

export type Dxf2DeprecatedTrackerEvent_Event = {
    assignedUser: string
    assignedUserDisplayName: string
    assignedUserFirstName: string
    assignedUserSurname: string
    assignedUserUsername: string
    attributeCategoryOptions: string
    attributeOptionCombo: string
    completedBy: string
    completedDate: string
    created: string
    createdAtClient: string
    createdByUserInfo: UserInfoSnapshot
    dataValues: Array<Dxf2DeprecatedTrackerEvent_DataValue>
    deleted: boolean
    dueDate: string
    enrollment: string
    enrollmentStatus: Dxf2DeprecatedTrackerEvent_Event.enrollmentStatus
    event: string
    eventDate: string
    followup: boolean
    geometry: Record<string, any>
    href: string
    lastUpdated: string
    lastUpdatedAtClient: string
    lastUpdatedByUserInfo: UserInfoSnapshot
    notes: Array<Note>
    orgUnit: string
    orgUnitName: string
    program: string
    programStage: string
    programType: Dxf2DeprecatedTrackerEvent_Event.programType
    relationships: Array<Relationship>
    status: Dxf2DeprecatedTrackerEvent_Event.status
    storedBy: string
    trackedEntityInstance: string
}

export namespace Dxf2DeprecatedTrackerEvent_Event {
    export enum enrollmentStatus {
        ACTIVE = 'ACTIVE',
        COMPLETED = 'COMPLETED',
        CANCELLED = 'CANCELLED',
    }

    export enum programType {
        WITH_REGISTRATION = 'WITH_REGISTRATION',
        WITHOUT_REGISTRATION = 'WITHOUT_REGISTRATION',
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
