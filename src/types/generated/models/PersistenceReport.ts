/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TrackerTypeReport } from './TrackerTypeReport'

export type PersistenceReport = {
    /**
     * keys are class org.hisp.dhis.tracker.imports.TrackerType
     */
    typeReportMap: Record<string, TrackerTypeReport>
}
