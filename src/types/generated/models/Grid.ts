/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GridHeader } from './GridHeader'
import type { PerformanceMetrics } from './PerformanceMetrics'
import type { Reference } from './Reference'

export type Grid = {
    headerWidth: number
    headers: Array<GridHeader>
    height: number
    internalMetaData: Record<string, Record<string, any>>
    lastDataRow: boolean
    metaColumnIndexes: Array<number>
    metaData: Record<string, Record<string, any>>
    metadataHeaders: Array<GridHeader>
    performanceMetrics: PerformanceMetrics
    refs: Array<Reference>
    /**
     * keys are class java.lang.Integer
     */
    rowContext: Record<string, Record<string, Record<string, any>>>
    rows: Array<Array<Record<string, any>>>
    subtitle: string
    table: string
    title: string
    visibleHeaders: Array<GridHeader>
    visibleRows: Array<Array<Record<string, any>>>
    visibleWidth: number
    width: number
}
