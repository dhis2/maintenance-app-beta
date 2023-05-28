/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Entity } from './Entity'
import type { TrackerImportsReport_Stats } from './TrackerImportsReport_Stats'

export type TrackerTypeReport = {
    objectReports: Array<Entity>
    stats: TrackerImportsReport_Stats
    trackerType: TrackerTypeReport.trackerType
}

export namespace TrackerTypeReport {
    export enum trackerType {
        TRACKED_ENTITY = 'TRACKED_ENTITY',
        ENROLLMENT = 'ENROLLMENT',
        EVENT = 'EVENT',
        RELATIONSHIP = 'RELATIONSHIP',
    }
}
