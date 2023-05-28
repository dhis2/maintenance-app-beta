/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Event } from './Event'
import type { Ref_Program_Enrollment } from './Ref_Program_Enrollment'
import type { Ref_Relationship_Relationship } from './Ref_Relationship_Relationship'
import type { TrackedEntity } from './TrackedEntity'

export type Relationship_RelationshipItem = {
    enrollment: Ref_Program_Enrollment
    event: Event
    relationship: Ref_Relationship_Relationship
    trackedEntity: TrackedEntity
}
