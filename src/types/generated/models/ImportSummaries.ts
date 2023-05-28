/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ImportOptions } from './ImportOptions'
import type { ImportSummary } from './ImportSummary'

export type ImportSummaries = {
    deleted: number
    ignored: number
    importOptions: ImportOptions
    importSummaries: Array<ImportSummary>
    imported: number
    responseType: string
    status: ImportSummaries.status
    total: number
    updated: number
}

export namespace ImportSummaries {
    export enum status {
        SUCCESS = 'SUCCESS',
        WARNING = 'WARNING',
        ERROR = 'ERROR',
    }
}
