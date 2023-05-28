/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { Expression } from './Expression'
import type { QueryModifiers } from './QueryModifiers'
import type { LegendSet } from './LegendSet'
import type { User } from './User'
import type { ValidationNotificationTemplate } from './ValidationNotificationTemplate'
import type { ValidationRuleGroup } from './ValidationRuleGroup'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type ValidationRule = {
    access: Access
    aggregateExportAttributeOptionCombo: string
    aggregateExportCategoryOptionCombo: string
    aggregationType: ValidationRule.aggregationType
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    description: string
    dimensionItem: string
    dimensionItemType: ValidationRule.dimensionItemType
    displayDescription: string
    displayFormName: string
    displayInstruction: string
    displayName: string
    displayShortName: string
    favorite: boolean
    favorites: Array<string>
    formName: string
    href: string
    id: string
    importance: ValidationRule.importance
    instruction: string
    lastUpdated: string
    lastUpdatedBy: User
    leftSide: Expression
    legendSet: LegendSet
    legendSets: Array<LegendSet>
    name: string
    notificationTemplates: Array<ValidationNotificationTemplate>
    operator: ValidationRule.operator
    organisationUnitLevels: Array<number>
    periodType: ValidationRule.periodType
    queryMods: QueryModifiers
    rightSide: Expression
    sharing: Sharing
    shortName: string
    skipFormValidation: boolean
    translations: Array<Translation>
    user: User
    validationRuleGroups: Array<ValidationRuleGroup>
}

export namespace ValidationRule {
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

    export enum dimensionItemType {
        DATA_ELEMENT = 'DATA_ELEMENT',
        DATA_ELEMENT_OPERAND = 'DATA_ELEMENT_OPERAND',
        INDICATOR = 'INDICATOR',
        REPORTING_RATE = 'REPORTING_RATE',
        PROGRAM_DATA_ELEMENT = 'PROGRAM_DATA_ELEMENT',
        PROGRAM_ATTRIBUTE = 'PROGRAM_ATTRIBUTE',
        PROGRAM_INDICATOR = 'PROGRAM_INDICATOR',
        PERIOD = 'PERIOD',
        ORGANISATION_UNIT = 'ORGANISATION_UNIT',
        CATEGORY_OPTION = 'CATEGORY_OPTION',
        OPTION_GROUP = 'OPTION_GROUP',
        DATA_ELEMENT_GROUP = 'DATA_ELEMENT_GROUP',
        ORGANISATION_UNIT_GROUP = 'ORGANISATION_UNIT_GROUP',
        CATEGORY_OPTION_GROUP = 'CATEGORY_OPTION_GROUP',
        EXPRESSION_DIMENSION_ITEM = 'EXPRESSION_DIMENSION_ITEM',
        SUBEXPRESSION_DIMENSION_ITEM = 'SUBEXPRESSION_DIMENSION_ITEM',
    }

    export enum importance {
        HIGH = 'HIGH',
        MEDIUM = 'MEDIUM',
        LOW = 'LOW',
    }

    export enum operator {
        EQUAL_TO = 'equal_to',
        NOT_EQUAL_TO = 'not_equal_to',
        GREATER_THAN = 'greater_than',
        GREATER_THAN_OR_EQUAL_TO = 'greater_than_or_equal_to',
        LESS_THAN = 'less_than',
        LESS_THAN_OR_EQUAL_TO = 'less_than_or_equal_to',
        COMPULSORY_PAIR = 'compulsory_pair',
        EXCLUSIVE_PAIR = 'exclusive_pair',
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
