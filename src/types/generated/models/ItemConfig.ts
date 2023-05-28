/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ItemConfig = {
    insertHeight: number
    insertPosition: ItemConfig.insertPosition
}

export namespace ItemConfig {
    export enum insertPosition {
        START = 'START',
        END = 'END',
    }
}
