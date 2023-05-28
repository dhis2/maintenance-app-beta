/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type AnalyticsPeriodBoundary = {
    access: Access
    analyticsPeriodBoundaryType: AnalyticsPeriodBoundary.analyticsPeriodBoundaryType
    attributeValues: Array<AttributeValue>
    boundaryTarget: string
    code: string
    created: string
    createdBy: User
    displayName: string
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    offsetPeriodType: AnalyticsPeriodBoundary.offsetPeriodType
    offsetPeriods: number
    sharing: Sharing
    translations: Array<Translation>
    user: User
}

export namespace AnalyticsPeriodBoundary {
    export enum analyticsPeriodBoundaryType {
        BEFORE_START_OF_REPORTING_PERIOD = 'BEFORE_START_OF_REPORTING_PERIOD',
        BEFORE_END_OF_REPORTING_PERIOD = 'BEFORE_END_OF_REPORTING_PERIOD',
        AFTER_START_OF_REPORTING_PERIOD = 'AFTER_START_OF_REPORTING_PERIOD',
        AFTER_END_OF_REPORTING_PERIOD = 'AFTER_END_OF_REPORTING_PERIOD',
    }

    export enum offsetPeriodType {
        BI_MONTHLY = 'BiMonthly',
        BI_WEEKLY = 'BiWeekly',
        DAILY = 'Daily',
        FINANCIAL_APRIL = 'FinancialApril',
        FINANCIAL_JULY = 'FinancialJuly',
        FINANCIAL_NOV = 'FinancialNov',
        FINANCIAL_OCT = 'FinancialOct',
        MONTHLY = 'Monthly',
        QUARTERLY = 'Quarterly',
        QUARTERLY_NOV = 'QuarterlyNov',
        SIX_MONTHLY_APRIL = 'SixMonthlyApril',
        SIX_MONTHLY_NOV = 'SixMonthlyNov',
        SIX_MONTHLY = 'SixMonthly',
        TWO_YEARLY = 'TwoYearly',
        WEEKLY = 'Weekly',
        WEEKLY_SATURDAY = 'WeeklySaturday',
        WEEKLY_SUNDAY = 'WeeklySunday',
        WEEKLY_THURSDAY = 'WeeklyThursday',
        WEEKLY_WEDNESDAY = 'WeeklyWednesday',
        YEARLY = 'Yearly',
    }
}
