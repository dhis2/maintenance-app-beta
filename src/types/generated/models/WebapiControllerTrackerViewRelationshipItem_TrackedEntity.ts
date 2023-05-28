/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UID_WebapiControllerTrackerViewRelationshipItem_TrackedEntity } from './UID_WebapiControllerTrackerViewRelationshipItem_TrackedEntity'
import type { WebapiControllerTrackerView_Attribute } from './WebapiControllerTrackerView_Attribute'
import type { WebapiControllerTrackerView_ProgramOwner } from './WebapiControllerTrackerView_ProgramOwner'
import type { WebapiControllerTrackerView_User } from './WebapiControllerTrackerView_User'
import type { WebapiControllerTrackerViewRelationshipItem_Enrollment } from './WebapiControllerTrackerViewRelationshipItem_Enrollment'

export type WebapiControllerTrackerViewRelationshipItem_TrackedEntity = {
    attributes: Array<WebapiControllerTrackerView_Attribute>
    createdAt: string | number
    createdAtClient: string | number
    createdBy: WebapiControllerTrackerView_User
    deleted: boolean
    enrollments: Array<WebapiControllerTrackerViewRelationshipItem_Enrollment>
    geometry: Record<string, any>
    inactive: boolean
    orgUnit: string
    potentialDuplicate: boolean
    programOwners: Array<WebapiControllerTrackerView_ProgramOwner>
    storedBy: string
    trackedEntity: UID_WebapiControllerTrackerViewRelationshipItem_TrackedEntity
    trackedEntityType: string
    updatedAt: string | number
    updatedAtClient: string | number
    updatedBy: WebapiControllerTrackerView_User
}
