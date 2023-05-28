/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Dxf2DeprecatedTrackerEvent_Event } from './Dxf2DeprecatedTrackerEvent_Event'
import type { Dxf2DeprecatedTrackerTrackedentity_Attribute } from './Dxf2DeprecatedTrackerTrackedentity_Attribute'
import type { Note } from './Note'
import type { Relationship } from './Relationship'
import type { UserInfoSnapshot } from './UserInfoSnapshot'

export type Enrollment = {
    attributes: Array<Dxf2DeprecatedTrackerTrackedentity_Attribute>
    completedBy: string
    completedDate: string
    created: string
    createdAtClient: string
    createdByUserInfo: UserInfoSnapshot
    deleted: boolean
    enrollment: string
    enrollmentDate: string
    events: Array<Dxf2DeprecatedTrackerEvent_Event>
    followup: boolean
    geometry: Record<string, any>
    incidentDate: string
    lastUpdated: string
    lastUpdatedAtClient: string
    lastUpdatedByUserInfo: UserInfoSnapshot
    notes: Array<Note>
    orgUnit: string
    orgUnitName: string
    program: string
    relationships: Array<Relationship>
    status: Enrollment.status
    storedBy: string
    trackedEntityInstance: string
    trackedEntityType: string
}

export namespace Enrollment {
    export enum status {
        ACTIVE = 'ACTIVE',
        COMPLETED = 'COMPLETED',
        CANCELLED = 'CANCELLED',
    }
}
