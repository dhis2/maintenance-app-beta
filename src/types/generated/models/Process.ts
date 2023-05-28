/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Stage } from './Stage'

export type Process = {
    cancelledTime: string
    complete: boolean
    completedTime: string
    description: string
    duration: number
    error: string
    jobId: string
    stages: Array<Stage>
    status: Process.status
    summary: string
    userId: string
}

export namespace Process {
    export enum status {
        RUNNING = 'RUNNING',
        SUCCESS = 'SUCCESS',
        ERROR = 'ERROR',
        CANCELLED = 'CANCELLED',
    }
}
