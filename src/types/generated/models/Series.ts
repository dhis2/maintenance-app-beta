/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Series = {
    axis: number
    dimensionItem: string
    type: Series.type
}

export namespace Series {
    export enum type {
        COLUMN = 'COLUMN',
        STACKED_COLUMN = 'STACKED_COLUMN',
        BAR = 'BAR',
        STACKED_BAR = 'STACKED_BAR',
        LINE = 'LINE',
        AREA = 'AREA',
        STACKED_AREA = 'STACKED_AREA',
        PIE = 'PIE',
        RADAR = 'RADAR',
        GAUGE = 'GAUGE',
        YEAR_OVER_YEAR_LINE = 'YEAR_OVER_YEAR_LINE',
        YEAR_OVER_YEAR_COLUMN = 'YEAR_OVER_YEAR_COLUMN',
        SCATTER = 'SCATTER',
        BUBBLE = 'BUBBLE',
        SINGLE_VALUE = 'SINGLE_VALUE',
        PIVOT_TABLE = 'PIVOT_TABLE',
    }
}
