/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DataIntegrityIssue } from './DataIntegrityIssue'

export type DataIntegrityDetails = {
    error: string
    finishedTime: string
    issues: Array<DataIntegrityIssue>
    startTime: string
}
