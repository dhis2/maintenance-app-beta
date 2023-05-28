/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Line } from './Line'
import type { StyledObject } from './StyledObject'

export type AxisV2 = {
    baseLine: Line
    decimals: number
    index: number
    label: StyledObject
    maxValue: number
    minValue: number
    steps: number
    targetLine: Line
    title: StyledObject
    type: AxisV2.type
}

export namespace AxisV2 {
    export enum type {
        DOMAIN = 'DOMAIN',
        RANGE = 'RANGE',
    }
}
