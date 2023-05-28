/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Item } from './Item'

export type Stage = {
    complete: boolean
    completedTime: string
    description: string
    duration: number
    error: string
    items: Array<Item>
    onFailure: Stage.onFailure
    status: Stage.status
    summary: string
    totalItems: number
}

export namespace Stage {
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
