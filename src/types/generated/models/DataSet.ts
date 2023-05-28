/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { DataElementOperand } from './DataElementOperand'
import type { DataInputPeriod } from './DataInputPeriod'
import type { DataSetElement } from './DataSetElement'
import type { ObjectStyle } from './ObjectStyle'
import type { QueryModifiers } from './QueryModifiers'
import type { CategoryCombo } from './CategoryCombo'
import type { DataApprovalWorkflow } from './DataApprovalWorkflow'
import type { DataEntryForm } from './DataEntryForm'
import type { Indicator } from './Indicator'
import type { Interpretation } from './Interpretation'
import type { LegendSet } from './LegendSet'
import type { OrganisationUnit } from './OrganisationUnit'
import type { Section } from './Section'
import type { User } from './User'
import type { UserGroup } from './UserGroup'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type DataSet = {
    access: Access
    aggregationType: DataSet.aggregationType
    attributeValues: Array<AttributeValue>
    categoryCombo: CategoryCombo
    code: string
    compulsoryDataElementOperands: Array<DataElementOperand>
    compulsoryFieldsCompleteOnly: boolean
    created: string
    createdBy: User
    dataElementDecoration: boolean
    dataEntryForm: DataEntryForm
    dataInputPeriods: Array<DataInputPeriod>
    dataSetElements: Array<DataSetElement>
    description: string
    dimensionItem: string
    displayDescription: string
    displayFormName: string
    displayName: string
    displayShortName: string
    expiryDays: number
    favorite: boolean
    favorites: Array<string>
    fieldCombinationRequired: boolean
    formName: string
    formType: DataSet.formType
    href: string
    id: string
    indicators: Array<Indicator>
    interpretations: Array<Interpretation>
    lastUpdated: string
    lastUpdatedBy: User
    legendSet: LegendSet
    legendSets: Array<LegendSet>
    mobile: boolean
    name: string
    noValueRequiresComment: boolean
    notificationRecipients: UserGroup
    notifyCompletingUser: boolean
    openFuturePeriods: number
    openPeriodsAfterCoEndDate: number
    organisationUnits: Array<OrganisationUnit>
    periodType: DataSet.periodType
    queryMods: QueryModifiers
    renderAsTabs: boolean
    renderHorizontally: boolean
    sections: Array<Section>
    sharing: Sharing
    shortName: string
    skipOffline: boolean
    style: ObjectStyle
    timelyDays: number
    translations: Array<Translation>
    user: User
    validCompleteOnly: boolean
    version: number
    workflow: DataApprovalWorkflow
}

export namespace DataSet {
    export enum aggregationType {
        SUM = 'SUM',
        AVERAGE = 'AVERAGE',
        AVERAGE_SUM_ORG_UNIT = 'AVERAGE_SUM_ORG_UNIT',
        LAST = 'LAST',
        LAST_AVERAGE_ORG_UNIT = 'LAST_AVERAGE_ORG_UNIT',
        LAST_LAST_ORG_UNIT = 'LAST_LAST_ORG_UNIT',
        LAST_IN_PERIOD = 'LAST_IN_PERIOD',
        LAST_IN_PERIOD_AVERAGE_ORG_UNIT = 'LAST_IN_PERIOD_AVERAGE_ORG_UNIT',
        FIRST = 'FIRST',
        FIRST_AVERAGE_ORG_UNIT = 'FIRST_AVERAGE_ORG_UNIT',
        FIRST_FIRST_ORG_UNIT = 'FIRST_FIRST_ORG_UNIT',
        COUNT = 'COUNT',
        STDDEV = 'STDDEV',
        VARIANCE = 'VARIANCE',
        MIN = 'MIN',
        MAX = 'MAX',
        MIN_SUM_ORG_UNIT = 'MIN_SUM_ORG_UNIT',
        MAX_SUM_ORG_UNIT = 'MAX_SUM_ORG_UNIT',
        NONE = 'NONE',
        CUSTOM = 'CUSTOM',
        DEFAULT = 'DEFAULT',
    }

    export enum formType {
        DEFAULT = 'DEFAULT',
        CUSTOM = 'CUSTOM',
        SECTION = 'SECTION',
        SECTION_MULTIORG = 'SECTION_MULTIORG',
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
