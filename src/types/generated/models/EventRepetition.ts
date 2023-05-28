/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type EventRepetition = {
    dimension: string
    indexes: Array<number>
    parent: EventRepetition.parent
}

export namespace EventRepetition {
    export enum parent {
        COLUMN = 'COLUMN',
        ROW = 'ROW',
        FILTER = 'FILTER',
    }
}
