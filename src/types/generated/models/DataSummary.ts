/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Dhis2Info } from './Dhis2Info'

export type DataSummary = {
    /**
     * keys are class java.lang.Integer
     */
    activeUsers: Record<string, number>
    /**
     * keys are class java.lang.Integer
     */
    dataValueCount: Record<string, number>
    /**
     * keys are class java.lang.Integer
     */
    eventCount: Record<string, number>
    objectCounts: Record<string, number>
    system: Dhis2Info
    userInvitations: Record<string, number>
}
