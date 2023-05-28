/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SimpleDimension = {
    dimension: string
    parent: SimpleDimension.parent
    values: Array<string>
}

export namespace SimpleDimension {
    export enum parent {
        COLUMN = 'COLUMN',
        ROW = 'ROW',
        FILTER = 'FILTER',
    }
}
