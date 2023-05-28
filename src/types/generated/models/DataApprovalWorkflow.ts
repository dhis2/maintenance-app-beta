/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { CategoryCombo } from './CategoryCombo'
import type { DataApprovalLevel } from './DataApprovalLevel'
import type { DataSet } from './DataSet'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type DataApprovalWorkflow = {
    access: Access
    attributeValues: Array<AttributeValue>
    categoryCombo: CategoryCombo
    code: string
    created: string
    createdBy: User
    dataApprovalLevels: Array<DataApprovalLevel>
    dataSets: Array<DataSet>
    displayName: string
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    periodType: DataApprovalWorkflow.periodType
    sharing: Sharing
    translations: Array<Translation>
    user: User
}

export namespace DataApprovalWorkflow {
    export enum periodType {
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
