/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { User } from './User'
import type { Visualization } from './Visualization'
import type { RelativePeriods } from './RelativePeriods'
import type { ReportingParams } from './ReportingParams'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type Report = {
    access: Access
    attributeValues: Array<AttributeValue>
    cacheStrategy: Report.cacheStrategy
    code: string
    created: string
    createdBy: User
    designContent: string
    displayName: string
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    relativePeriods: RelativePeriods
    reportParams: ReportingParams
    sharing: Sharing
    translations: Array<Translation>
    type: Report.type
    user: User
    visualization: Visualization
}

export namespace Report {
    export enum cacheStrategy {
        NO_CACHE = 'NO_CACHE',
        CACHE_1_MINUTE = 'CACHE_1_MINUTE',
        CACHE_5_MINUTES = 'CACHE_5_MINUTES',
        CACHE_10_MINUTES = 'CACHE_10_MINUTES',
        CACHE_15_MINUTES = 'CACHE_15_MINUTES',
        CACHE_30_MINUTES = 'CACHE_30_MINUTES',
        CACHE_1_HOUR = 'CACHE_1_HOUR',
        CACHE_6AM_TOMORROW = 'CACHE_6AM_TOMORROW',
        CACHE_TWO_WEEKS = 'CACHE_TWO_WEEKS',
        RESPECT_SYSTEM_SETTING = 'RESPECT_SYSTEM_SETTING',
    }

    export enum type {
        JASPER_REPORT_TABLE = 'JASPER_REPORT_TABLE',
        JASPER_JDBC = 'JASPER_JDBC',
        HTML = 'HTML',
    }
}
