/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type OutboundMessageResponseSummary = {
    batchType: OutboundMessageResponseSummary.batchType
    errorMessage: string
    failed: number
    pending: number
    responseMessage: string
    sent: number
    status: OutboundMessageResponseSummary.status
    total: number
}

export namespace OutboundMessageResponseSummary {
    export enum batchType {
        SMS = 'SMS',
        EMAIL = 'EMAIL',
        HTTP = 'HTTP',
    }

    export enum status {
        COMPLETED = 'COMPLETED',
        FAILED = 'FAILED',
        PENDING = 'PENDING',
        ABORTED = 'ABORTED',
    }
}
