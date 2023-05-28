/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UID_WebapiControllerTrackerView_TrackedEntity } from './UID_WebapiControllerTrackerView_TrackedEntity'
import type { WebapiControllerTrackerView_Attribute } from './WebapiControllerTrackerView_Attribute'
import type { WebapiControllerTrackerView_Enrollment } from './WebapiControllerTrackerView_Enrollment'
import type { WebapiControllerTrackerView_ProgramOwner } from './WebapiControllerTrackerView_ProgramOwner'
import type { WebapiControllerTrackerView_Relationship } from './WebapiControllerTrackerView_Relationship'
import type { WebapiControllerTrackerView_User } from './WebapiControllerTrackerView_User'

export type WebapiControllerTrackerView_TrackedEntity = {
    attributes: Array<WebapiControllerTrackerView_Attribute>
    createdAt: string | number
    createdAtClient: string | number
    createdBy: WebapiControllerTrackerView_User
    deleted: boolean
    enrollments: Array<WebapiControllerTrackerView_Enrollment>
    geometry: Record<string, any>
    inactive: boolean
    orgUnit: string
    potentialDuplicate: boolean
    programOwners: Array<WebapiControllerTrackerView_ProgramOwner>
    relationships: Array<WebapiControllerTrackerView_Relationship>
    storedBy: string
    trackedEntity: UID_WebapiControllerTrackerView_TrackedEntity
    trackedEntityType: string
    updatedAt: string | number
    updatedAtClient: string | number
    updatedBy: WebapiControllerTrackerView_User
}
