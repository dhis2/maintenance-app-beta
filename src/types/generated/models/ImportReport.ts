/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MetadataImportParams } from './MetadataImportParams'
import type { Stats } from './Stats'
import type { TypeReport } from './TypeReport'

export type ImportReport = {
    importParams: MetadataImportParams
    stats: Stats
    status: ImportReport.status
    typeReports: Array<TypeReport>
}

export namespace ImportReport {
    export enum status {
        OK = 'OK',
        WARNING = 'WARNING',
        ERROR = 'ERROR',
    }
}
