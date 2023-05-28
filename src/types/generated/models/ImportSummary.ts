/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ImportConflict } from './ImportConflict'
import type { ImportCount } from './ImportCount'
import type { ImportOptions } from './ImportOptions'
import type { ImportSummaries } from './ImportSummaries'

export type ImportSummary = {
    conflicts: Array<ImportConflict>
    dataSetComplete: string
    description: string
    enrollments: ImportSummaries
    events: ImportSummaries
    href: string
    importCount: ImportCount
    importOptions: ImportOptions
    reference: string
    rejectedIndexes: Array<number>
    relationships: ImportSummaries
    responseType: string
    status: ImportSummary.status
}

export namespace ImportSummary {
    export enum status {
        SUCCESS = 'SUCCESS',
        WARNING = 'WARNING',
        ERROR = 'ERROR',
    }
}
