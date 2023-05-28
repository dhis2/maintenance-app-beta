/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Api } from './Api'
import type { TargetRequest } from './TargetRequest'

export type Target = {
    api: Api
    request: TargetRequest
    type: Target.type
}

export namespace Target {
    export enum type {
        INTERNAL = 'INTERNAL',
        EXTERNAL = 'EXTERNAL',
    }
}
