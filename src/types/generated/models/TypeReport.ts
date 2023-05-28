/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReport } from './ObjectReport'
import type { Stats } from './Stats'

export type TypeReport = {
    klass: string
    objectReports: Array<ObjectReport>
    stats: Stats
}
