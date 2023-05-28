/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ExecutionPlan } from './ExecutionPlan'

export type PerformanceMetrics = {
    executionPlans: Array<ExecutionPlan>
    totalTimeInMillis: number
}
