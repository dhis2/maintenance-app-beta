/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ContinuousAnalyticsJobParameters = {
    fullUpdateHourOfDay: number
    lastYears: number
    skipTableTypes: Array<
        | 'DATA_VALUE'
        | 'COMPLETENESS'
        | 'COMPLETENESS_TARGET'
        | 'ORG_UNIT_TARGET'
        | 'EVENT'
        | 'ENROLLMENT'
        | 'OWNERSHIP'
        | 'VALIDATION_RESULT'
        | 'TRACKED_ENTITY_INSTANCE_EVENTS'
        | 'TRACKED_ENTITY_INSTANCE_ENROLLMENTS'
        | 'TRACKED_ENTITY_INSTANCE'
    >
}
