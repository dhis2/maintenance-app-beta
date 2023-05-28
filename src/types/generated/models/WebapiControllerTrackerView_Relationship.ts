/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UID_RelationshipType } from './UID_RelationshipType'
import type { UID_WebapiControllerTrackerView_Relationship } from './UID_WebapiControllerTrackerView_Relationship'
import type { WebapiControllerTrackerView_RelationshipItem } from './WebapiControllerTrackerView_RelationshipItem'

export type WebapiControllerTrackerView_Relationship = {
    bidirectional: boolean
    createdAt: string | number
    from: WebapiControllerTrackerView_RelationshipItem
    relationship: UID_WebapiControllerTrackerView_Relationship
    relationshipName: string
    relationshipType: UID_RelationshipType
    to: WebapiControllerTrackerView_RelationshipItem
    updatedAt: string | number
}
