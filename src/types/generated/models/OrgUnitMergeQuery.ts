/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type OrgUnitMergeQuery = {
    dataApprovalMergeStrategy: OrgUnitMergeQuery.dataApprovalMergeStrategy
    dataValueMergeStrategy: OrgUnitMergeQuery.dataValueMergeStrategy
    deleteSources: boolean
    sources: Array<string>
    target: string
}

export namespace OrgUnitMergeQuery {
    export enum dataApprovalMergeStrategy {
        LAST_UPDATED = 'LAST_UPDATED',
        DISCARD = 'DISCARD',
    }

    export enum dataValueMergeStrategy {
        LAST_UPDATED = 'LAST_UPDATED',
        DISCARD = 'DISCARD',
    }
}
