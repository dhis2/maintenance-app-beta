/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Error } from './Error'

export type Entity = {
    errorReports: Array<Error>
    index: number
    trackerType: Entity.trackerType
    uid: string
}

export namespace Entity {
    export enum trackerType {
        TRACKED_ENTITY = 'TRACKED_ENTITY',
        ENROLLMENT = 'ENROLLMENT',
        EVENT = 'EVENT',
        RELATIONSHIP = 'RELATIONSHIP',
    }
}
