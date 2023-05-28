/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Item = {
    complete: boolean
    completedTime: string
    description: string
    duration: number
    error: string
    onFailure: Item.onFailure
    status: Item.status
    summary: string
}

export namespace Item {
    export enum onFailure {
        PARENT = 'PARENT',
        FAIL = 'FAIL',
        SKIP_STAGE = 'SKIP_STAGE',
        SKIP_ITEM = 'SKIP_ITEM',
        SKIP_ITEM_OUTLIER = 'SKIP_ITEM_OUTLIER',
    }

    export enum status {
        RUNNING = 'RUNNING',
        SUCCESS = 'SUCCESS',
        ERROR = 'ERROR',
        CANCELLED = 'CANCELLED',
    }
}
