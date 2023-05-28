/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Dxf2DeprecatedTrackerEvent_Event } from './Dxf2DeprecatedTrackerEvent_Event'
import type { Enrollment } from './Enrollment'
import type { TrackedEntityInstance } from './TrackedEntityInstance'

export type RelationshipItem = {
    enrollment: Enrollment
    event: Dxf2DeprecatedTrackerEvent_Event
    trackedEntityInstance: TrackedEntityInstance
}
