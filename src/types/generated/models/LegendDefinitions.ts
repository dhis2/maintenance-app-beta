/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LegendSet } from './LegendSet'

export type LegendDefinitions = {
    set: LegendSet
    showKey: boolean
    strategy: LegendDefinitions.strategy
    style: LegendDefinitions.style
}

export namespace LegendDefinitions {
    export enum strategy {
        FIXED = 'FIXED',
        BY_DATA_ITEM = 'BY_DATA_ITEM',
    }

    export enum style {
        FILL = 'FILL',
        TEXT = 'TEXT',
    }
}
