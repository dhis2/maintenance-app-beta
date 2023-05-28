/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LegendSet } from './LegendSet'
import type { TrackedEntityAttribute } from './TrackedEntityAttribute'

export type TrackedEntityAttributeDimension = {
    attribute: TrackedEntityAttribute
    filter: string
    legendSet: LegendSet
}
