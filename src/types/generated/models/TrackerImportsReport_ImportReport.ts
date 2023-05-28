/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PersistenceReport } from './PersistenceReport'
import type { TimingsStats } from './TimingsStats'
import type { TrackerImportsReport_Stats } from './TrackerImportsReport_Stats'
import type { ValidationReport } from './ValidationReport'

export type TrackerImportsReport_ImportReport = {
    bundleReport: PersistenceReport
    message: string
    stats: TrackerImportsReport_Stats
    status: TrackerImportsReport_ImportReport.status
    timingsStats: TimingsStats
    validationReport: ValidationReport
}

export namespace TrackerImportsReport_ImportReport {
    export enum status {
        OK = 'OK',
        WARNING = 'WARNING',
        ERROR = 'ERROR',
    }
}
