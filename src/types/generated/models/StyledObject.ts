/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FontStyle } from './FontStyle'

export type StyledObject = {
    fontStyle: FontStyle
    text: string
    textMode: StyledObject.textMode
}

export namespace StyledObject {
    export enum textMode {
        AUTO = 'AUTO',
        CUSTOM = 'CUSTOM',
    }
}
