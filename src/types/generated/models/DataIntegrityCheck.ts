/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type DataIntegrityCheck = {
    code: string
    description: string
    displayName: string
    introduction: string
    isSlow: boolean
    issuesIdType: string
    name: string
    recommendation: string
    section: string
    severity: DataIntegrityCheck.severity
}

export namespace DataIntegrityCheck {
    export enum severity {
        INFO = 'INFO',
        WARNING = 'WARNING',
        SEVERE = 'SEVERE',
        CRITICAL = 'CRITICAL',
    }
}
