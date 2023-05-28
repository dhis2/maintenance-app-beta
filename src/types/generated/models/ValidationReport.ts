/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Error } from './Error'
import type { Warning } from './Warning'

export type ValidationReport = {
    errorReports: Array<Error>
    warningReports: Array<Warning>
}
