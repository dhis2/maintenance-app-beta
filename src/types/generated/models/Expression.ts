/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Translation } from './Translation'

export type Expression = {
    description: string
    displayDescription: string
    expression: string
    missingValueStrategy: Expression.missingValueStrategy
    slidingWindow: boolean
    translations: Array<Translation>
}

export namespace Expression {
    export enum missingValueStrategy {
        SKIP_IF_ANY_VALUE_MISSING = 'SKIP_IF_ANY_VALUE_MISSING',
        SKIP_IF_ALL_VALUES_MISSING = 'SKIP_IF_ALL_VALUES_MISSING',
        NEVER_SKIP = 'NEVER_SKIP',
    }
}
