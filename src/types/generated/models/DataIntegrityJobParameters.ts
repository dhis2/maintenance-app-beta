/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type DataIntegrityJobParameters = {
    checks: Array<string>
    type: DataIntegrityJobParameters.type
}

export namespace DataIntegrityJobParameters {
    export enum type {
        REPORT = 'REPORT',
        SUMMARY = 'SUMMARY',
        DETAILS = 'DETAILS',
    }
}
