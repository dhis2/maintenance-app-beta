/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SchedulerEntryJob } from './SchedulerEntryJob'

export type SchedulerEntry = {
    configurable: boolean
    cronExpression: string
    delay: number
    enabled: boolean
    name: string
    nextExecutionTime: string
    sequence: Array<SchedulerEntryJob>
    status: SchedulerEntry.status
    type: string
}

export namespace SchedulerEntry {
    export enum status {
        RUNNING = 'RUNNING',
        COMPLETED = 'COMPLETED',
        STOPPED = 'STOPPED',
        SCHEDULED = 'SCHEDULED',
        DISABLED = 'DISABLED',
        FAILED = 'FAILED',
        NOT_STARTED = 'NOT_STARTED',
    }
}
