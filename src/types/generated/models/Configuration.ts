/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DataElementGroup } from './DataElementGroup'
import type { IndicatorGroup } from './IndicatorGroup'
import type { OrganisationUnit } from './OrganisationUnit'
import type { OrganisationUnitGroupSet } from './OrganisationUnitGroupSet'
import type { OrganisationUnitLevel } from './OrganisationUnitLevel'
import type { UserGroup } from './UserGroup'
import type { UserRole } from './UserRole'

export type Configuration = {
    corsWhitelist: Array<string>
    facilityOrgUnitGroupSet: OrganisationUnitGroupSet
    facilityOrgUnitLevel: OrganisationUnitLevel
    feedbackRecipients: UserGroup
    infrastructuralDataElements: DataElementGroup
    infrastructuralIndicators: IndicatorGroup
    infrastructuralPeriodType: Configuration.infrastructuralPeriodType
    offlineOrganisationUnitLevel: OrganisationUnitLevel
    selfRegistrationOrgUnit: OrganisationUnit
    selfRegistrationRole: UserRole
    systemId: string
    systemUpdateNotificationRecipients: UserGroup
}

export namespace Configuration {
    export enum infrastructuralPeriodType {
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
