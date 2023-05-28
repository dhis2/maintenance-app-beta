/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { Expression } from './Expression'
import type { CategoryOptionCombo } from './CategoryOptionCombo'
import type { DataElement } from './DataElement'
import type { OrganisationUnitLevel } from './OrganisationUnitLevel'
import type { PredictorGroup } from './PredictorGroup'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type Predictor = {
    access: Access
    annualSampleCount: number
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    description: string
    displayDescription: string
    displayFormName: string
    displayName: string
    displayShortName: string
    favorite: boolean
    favorites: Array<string>
    formName: string
    generator: Expression
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    organisationUnitDescendants: Predictor.organisationUnitDescendants
    organisationUnitLevels: Array<OrganisationUnitLevel>
    output: DataElement
    outputCombo: CategoryOptionCombo
    periodType: Predictor.periodType
    predictorGroups: Array<PredictorGroup>
    sampleSkipTest: Expression
    sequentialSampleCount: number
    sequentialSkipCount: number
    sharing: Sharing
    shortName: string
    translations: Array<Translation>
    user: User
}

export namespace Predictor {
    export enum organisationUnitDescendants {
        SELECTED = 'SELECTED',
        DESCENDANTS = 'DESCENDANTS',
    }

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
