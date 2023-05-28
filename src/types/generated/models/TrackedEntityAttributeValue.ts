/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TrackedEntity } from './TrackedEntity'
import type { TrackedEntityAttribute } from './TrackedEntityAttribute'

export type TrackedEntityAttributeValue = {
    created: string
    lastUpdated: string
    storedBy: string
    trackedEntityAttribute: TrackedEntityAttribute
    trackedEntityInstance: TrackedEntity
    value: string
}
