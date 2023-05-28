/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { ObjectStyle } from './ObjectStyle'
import type { ProgramTrackedEntityAttribute } from './ProgramTrackedEntityAttribute'
import type { CategoryCombo } from './CategoryCombo'
import type { DataEntryForm } from './DataEntryForm'
import type { OrganisationUnit } from './OrganisationUnit'
import type { ProgramIndicator } from './ProgramIndicator'
import type { ProgramNotificationTemplate } from './ProgramNotificationTemplate'
import type { ProgramRuleVariable } from './ProgramRuleVariable'
import type { ProgramSection } from './ProgramSection'
import type { ProgramStage } from './ProgramStage'
import type { TrackedEntityType } from './TrackedEntityType'
import type { User } from './User'
import type { UserRole } from './UserRole'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type Program = {
    access: Access
    accessLevel: Program.accessLevel
    attributeValues: Array<AttributeValue>
    categoryCombo: CategoryCombo
    code: string
    completeEventsExpiryDays: number
    created: string
    createdBy: User
    dataEntryForm: DataEntryForm
    description: string
    displayDescription: string
    displayEnrollmentDateLabel: string
    displayFormName: string
    displayFrontPageList: boolean
    displayIncidentDate: boolean
    displayIncidentDateLabel: string
    displayName: string
    displayShortName: string
    enrollmentDateLabel: string
    expiryDays: number
    expiryPeriodType: Program.expiryPeriodType
    favorite: boolean
    favorites: Array<string>
    featureType: Program.featureType
    formName: string
    href: string
    id: string
    ignoreOverdueEvents: boolean
    incidentDateLabel: string
    lastUpdated: string
    lastUpdatedBy: User
    maxTeiCountToReturn: number
    minAttributesRequiredToSearch: number
    name: string
    notificationTemplates: Array<ProgramNotificationTemplate>
    onlyEnrollOnce: boolean
    openDaysAfterCoEndDate: number
    organisationUnits: Array<OrganisationUnit>
    programIndicators: Array<ProgramIndicator>
    programRuleVariables: Array<ProgramRuleVariable>
    programSections: Array<ProgramSection>
    programStages: Array<ProgramStage>
    programTrackedEntityAttributes: Array<ProgramTrackedEntityAttribute>
    programType: Program.programType
    registration: boolean
    relatedProgram: Program
    selectEnrollmentDatesInFuture: boolean
    selectIncidentDatesInFuture: boolean
    sharing: Sharing
    shortName: string
    skipOffline: boolean
    style: ObjectStyle
    trackedEntityType: TrackedEntityType
    translations: Array<Translation>
    useFirstStageDuringRegistration: boolean
    user: User
    userRoles: Array<UserRole>
    version: number
    withoutRegistration: boolean
}

export namespace Program {
    export enum accessLevel {
        OPEN = 'OPEN',
        AUDITED = 'AUDITED',
        PROTECTED = 'PROTECTED',
        CLOSED = 'CLOSED',
    }

    export enum expiryPeriodType {
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

    export enum featureType {
        NONE = 'NONE',
        MULTI_POLYGON = 'MULTI_POLYGON',
        POLYGON = 'POLYGON',
        POINT = 'POINT',
        SYMBOL = 'SYMBOL',
    }

    export enum programType {
        WITH_REGISTRATION = 'WITH_REGISTRATION',
        WITHOUT_REGISTRATION = 'WITHOUT_REGISTRATION',
    }
}
