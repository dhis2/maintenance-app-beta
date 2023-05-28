/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type TestJobParameters = {
    failAtItem: number
    failAtStage: number
    failWithException: boolean
    failWithMessage: string
    failWithPolicy: TestJobParameters.failWithPolicy
    itemDuration: number
    items: number
    runStagesParallel: boolean
    stages: number
    waitMillis: number
}

export namespace TestJobParameters {
    export enum failWithPolicy {
        PARENT = 'PARENT',
        FAIL = 'FAIL',
        SKIP_STAGE = 'SKIP_STAGE',
        SKIP_ITEM = 'SKIP_ITEM',
        SKIP_ITEM_OUTLIER = 'SKIP_ITEM_OUTLIER',
    }
}
