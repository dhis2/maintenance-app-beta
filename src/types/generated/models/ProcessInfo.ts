/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ProcessInfo = {
    cancelledTime: string
    completedTime: string
    description: string
    error: string
    jobId: string
    stages: Array<string>
    startedTime: string
    status: ProcessInfo.status
    summary: string
}

export namespace ProcessInfo {
    export enum status {
        RUNNING = 'RUNNING',
        SUCCESS = 'SUCCESS',
        ERROR = 'ERROR',
        CANCELLED = 'CANCELLED',
    }
}
