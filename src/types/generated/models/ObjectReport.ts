/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ErrorReport } from './ErrorReport'

export type ObjectReport = {
    displayName: string
    errorReports: Array<ErrorReport>
    index: number
    klass: string
    uid: string
}
