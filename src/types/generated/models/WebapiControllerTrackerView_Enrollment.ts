/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UID_WebapiControllerTrackerView_Enrollment } from './UID_WebapiControllerTrackerView_Enrollment'
import type { UID_WebapiControllerTrackerView_TrackedEntity } from './UID_WebapiControllerTrackerView_TrackedEntity'
import type { WebapiControllerTrackerView_Attribute } from './WebapiControllerTrackerView_Attribute'
import type { WebapiControllerTrackerView_Event } from './WebapiControllerTrackerView_Event'
import type { WebapiControllerTrackerView_Note } from './WebapiControllerTrackerView_Note'
import type { WebapiControllerTrackerView_Relationship } from './WebapiControllerTrackerView_Relationship'
import type { WebapiControllerTrackerView_User } from './WebapiControllerTrackerView_User'

export type WebapiControllerTrackerView_Enrollment = {
    attributes: Array<WebapiControllerTrackerView_Attribute>
    completedAt: string | number
    completedBy: string
    createdAt: string | number
    createdAtClient: string | number
    createdBy: WebapiControllerTrackerView_User
    deleted: boolean
    enrolledAt: string | number
    enrollment: UID_WebapiControllerTrackerView_Enrollment
    events: Array<WebapiControllerTrackerView_Event>
    followUp: boolean
    geometry: Record<string, any>
    notes: Array<WebapiControllerTrackerView_Note>
    occurredAt: string | number
    orgUnit: string
    orgUnitName: string
    program: string
    relationships: Array<WebapiControllerTrackerView_Relationship>
    status: WebapiControllerTrackerView_Enrollment.status
    storedBy: string
    trackedEntity: UID_WebapiControllerTrackerView_TrackedEntity
    updatedAt: string | number
    updatedAtClient: string | number
    updatedBy: WebapiControllerTrackerView_User
}

export namespace WebapiControllerTrackerView_Enrollment {
    export enum status {
        ACTIVE = 'ACTIVE',
        COMPLETED = 'COMPLETED',
        CANCELLED = 'CANCELLED',
    }
}
