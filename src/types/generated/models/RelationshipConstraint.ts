/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Program } from './Program'
import type { ProgramStage } from './ProgramStage'
import type { TrackedEntityType } from './TrackedEntityType'
import type { TrackerDataView } from './TrackerDataView'

export type RelationshipConstraint = {
    program: Program
    programStage: ProgramStage
    relationshipEntity: RelationshipConstraint.relationshipEntity
    trackedEntityType: TrackedEntityType
    trackerDataView: TrackerDataView
}

export namespace RelationshipConstraint {
    export enum relationshipEntity {
        TRACKED_ENTITY_INSTANCE = 'TRACKED_ENTITY_INSTANCE',
        PROGRAM_INSTANCE = 'PROGRAM_INSTANCE',
        PROGRAM_STAGE_INSTANCE = 'PROGRAM_STAGE_INSTANCE',
    }
}
