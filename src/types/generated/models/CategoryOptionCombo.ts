/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { QueryModifiers } from './QueryModifiers'
import type { CategoryCombo } from './CategoryCombo'
import type { CategoryOption } from './CategoryOption'
import type { LegendSet } from './LegendSet'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type CategoryOptionCombo = {
    access: Access
    aggregationType: CategoryOptionCombo.aggregationType
    attributeValues: Array<AttributeValue>
    categoryCombo: CategoryCombo
    categoryOptions: Array<CategoryOption>
    code: string
    created: string
    createdBy: User
    description: string
    dimensionItem: string
    dimensionItemType: CategoryOptionCombo.dimensionItemType
    displayDescription: string
    displayFormName: string
    displayName: string
    displayShortName: string
    favorite: boolean
    favorites: Array<string>
    formName: string
    href: string
    id: string
    ignoreApproval: boolean
    lastUpdated: string
    lastUpdatedBy: User
    legendSet: LegendSet
    legendSets: Array<LegendSet>
    queryMods: QueryModifiers
    sharing: Sharing
    translations: Array<Translation>
    user: User
}

export namespace CategoryOptionCombo {
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
}
