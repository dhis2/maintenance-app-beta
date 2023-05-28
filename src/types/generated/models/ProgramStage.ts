/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { ObjectStyle } from './ObjectStyle'
import type { ProgramStageDataElement } from './ProgramStageDataElement'
import type { DataElement } from './DataElement'
import type { DataEntryForm } from './DataEntryForm'
import type { Program } from './Program'
import type { ProgramNotificationTemplate } from './ProgramNotificationTemplate'
import type { ProgramStageSection } from './ProgramStageSection'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type ProgramStage = {
    access: Access
    allowGenerateNextVisit: boolean
    attributeValues: Array<AttributeValue>
    autoGenerateEvent: boolean
    blockEntryForm: boolean
    code: string
    created: string
    createdBy: User
    dataEntryForm: DataEntryForm
    description: string
    displayDescription: string
    displayDueDateLabel: string
    displayExecutionDateLabel: string
    displayFormName: string
    displayGenerateEventBox: boolean
    displayName: string
    displayShortName: string
    dueDateLabel: string
    enableUserAssignment: boolean
    executionDateLabel: string
    favorite: boolean
    favorites: Array<string>
    featureType: ProgramStage.featureType
    formName: string
    formType: ProgramStage.formType
    generatedByEnrollmentDate: boolean
    hideDueDate: boolean
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    minDaysFromStart: number
    name: string
    nextScheduleDate: DataElement
    notificationTemplates: Array<ProgramNotificationTemplate>
    openAfterEnrollment: boolean
    periodType: ProgramStage.periodType
    preGenerateUID: boolean
    program: Program
    programStageDataElements: Array<ProgramStageDataElement>
    programStageSections: Array<ProgramStageSection>
    referral: boolean
    remindCompleted: boolean
    repeatable: boolean
    reportDateToUse: string
    sharing: Sharing
    shortName: string
    sortOrder: number
    standardInterval: number
    style: ObjectStyle
    translations: Array<Translation>
    user: User
    validationStrategy: ProgramStage.validationStrategy
}

export namespace ProgramStage {
    export enum featureType {
        NONE = 'NONE',
        MULTI_POLYGON = 'MULTI_POLYGON',
        POLYGON = 'POLYGON',
        POINT = 'POINT',
        SYMBOL = 'SYMBOL',
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

    export enum validationStrategy {
        ON_COMPLETE = 'ON_COMPLETE',
        ON_UPDATE_AND_INSERT = 'ON_UPDATE_AND_INSERT',
    }
}
