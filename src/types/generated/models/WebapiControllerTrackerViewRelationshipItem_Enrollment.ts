/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UID_WebapiControllerTrackerViewRelationshipItem_Enrollment } from './UID_WebapiControllerTrackerViewRelationshipItem_Enrollment'
import type { WebapiControllerTrackerView_Attribute } from './WebapiControllerTrackerView_Attribute'
import type { WebapiControllerTrackerView_Note } from './WebapiControllerTrackerView_Note'
import type { WebapiControllerTrackerView_User } from './WebapiControllerTrackerView_User'
import type { WebapiControllerTrackerViewRelationshipItem_Event } from './WebapiControllerTrackerViewRelationshipItem_Event'

export type WebapiControllerTrackerViewRelationshipItem_Enrollment = {
    attributes: Array<WebapiControllerTrackerView_Attribute>
    completedAt: string | number
    completedBy: string
    createdAt: string | number
    createdAtClient: string | number
    createdBy: WebapiControllerTrackerView_User
    deleted: boolean
    enrolledAt: string | number
    enrollment: UID_WebapiControllerTrackerViewRelationshipItem_Enrollment
    events: Array<WebapiControllerTrackerViewRelationshipItem_Event>
    followUp: boolean
    geometry: Record<string, any>
    notes: Array<WebapiControllerTrackerView_Note>
    occurredAt: string | number
    orgUnit: string
    orgUnitName: string
    program: string
    status: WebapiControllerTrackerViewRelationshipItem_Enrollment.status
    storedBy: string
    trackedEntity: string
    updatedAt: string | number
    updatedAtClient: string | number
    updatedBy: WebapiControllerTrackerView_User
}

export namespace WebapiControllerTrackerViewRelationshipItem_Enrollment {
    export enum status {
        ACTIVE = 'ACTIVE',
        COMPLETED = 'COMPLETED',
        CANCELLED = 'CANCELLED',
    }
}
