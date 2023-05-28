/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UID_WebapiControllerTrackerViewRelationshipItem_Event } from './UID_WebapiControllerTrackerViewRelationshipItem_Event'
import type { WebapiControllerTrackerView_DataValue } from './WebapiControllerTrackerView_DataValue'
import type { WebapiControllerTrackerView_Note } from './WebapiControllerTrackerView_Note'
import type { WebapiControllerTrackerView_User } from './WebapiControllerTrackerView_User'

export type WebapiControllerTrackerViewRelationshipItem_Event = {
    assignedUser: WebapiControllerTrackerView_User
    attributeCategoryOptions: string
    attributeOptionCombo: string
    completedAt: string | number
    completedBy: string
    createdAt: string | number
    createdAtClient: string | number
    createdBy: WebapiControllerTrackerView_User
    dataValues: Array<WebapiControllerTrackerView_DataValue>
    deleted: boolean
    enrollment: string
    event: UID_WebapiControllerTrackerViewRelationshipItem_Event
    followup: boolean
    geometry: Record<string, any>
    notes: Array<WebapiControllerTrackerView_Note>
    occurredAt: string | number
    orgUnit: string
    orgUnitName: string
    program: string
    programStage: string
    scheduledAt: string | number
    status: WebapiControllerTrackerViewRelationshipItem_Event.status
    storedBy: string
    updatedAt: string | number
    updatedAtClient: string | number
    updatedBy: WebapiControllerTrackerView_User
}

export namespace WebapiControllerTrackerViewRelationshipItem_Event {
    export enum status {
        ACTIVE = 'ACTIVE',
        COMPLETED = 'COMPLETED',
        VISITED = 'VISITED',
        SCHEDULE = 'SCHEDULE',
        OVERDUE = 'OVERDUE',
        SKIPPED = 'SKIPPED',
    }
}
