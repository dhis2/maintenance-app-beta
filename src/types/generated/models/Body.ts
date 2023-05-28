/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { WebapiControllerTrackerView_Enrollment } from './WebapiControllerTrackerView_Enrollment'
import type { WebapiControllerTrackerView_Event } from './WebapiControllerTrackerView_Event'
import type { WebapiControllerTrackerView_Relationship } from './WebapiControllerTrackerView_Relationship'
import type { WebapiControllerTrackerView_TrackedEntity } from './WebapiControllerTrackerView_TrackedEntity'

export type Body = {
    enrollments: Array<WebapiControllerTrackerView_Enrollment>
    events: Array<WebapiControllerTrackerView_Event>
    relationships: Array<WebapiControllerTrackerView_Relationship>
    trackedEntities: Array<WebapiControllerTrackerView_TrackedEntity>
}
