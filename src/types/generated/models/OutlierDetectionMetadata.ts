/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type OutlierDetectionMetadata = {
    algorithm: OutlierDetectionMetadata.algorithm
    count: number
    dataEndDate: string
    dataStartDate: string
    maxResults: number
    orderBy: OutlierDetectionMetadata.orderBy
    threshold: number
}

export namespace OutlierDetectionMetadata {
    export enum algorithm {
        Z_SCORE = 'Z_SCORE',
        MIN_MAX = 'MIN_MAX',
        MOD_Z_SCORE = 'MOD_Z_SCORE',
    }

    export enum orderBy {
        MEAN_ABS_DEV = 'MEAN_ABS_DEV',
        Z_SCORE = 'Z_SCORE',
    }
}
