/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DataElement } from './DataElement'
import type { LegendSet } from './LegendSet'
import type { ProgramStage } from './ProgramStage'

export type TrackedEntityDataElementDimension = {
    dataElement: DataElement
    filter: string
    legendSet: LegendSet
    programStage: ProgramStage
}
