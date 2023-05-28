/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ErrorReport } from './ErrorReport'
import type { IdObject } from './IdObject'

export type CascadeSharingReport = {
    countUpdatedDashboardItems: number
    errorReports: Array<ErrorReport>
    updateObjects: Record<string, Array<IdObject>>
}
