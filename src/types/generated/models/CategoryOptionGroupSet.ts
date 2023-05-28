/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { DimensionItemKeywords } from './DimensionItemKeywords'
import type { EventRepetition } from './EventRepetition'
import type { CategoryOptionGroup } from './CategoryOptionGroup'
import type { DimensionalItemObject } from './DimensionalItemObject'
import type { LegendSet } from './LegendSet'
import type { OptionSet } from './OptionSet'
import type { ProgramStage } from './ProgramStage'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type CategoryOptionGroupSet = {
    access: Access
    aggregationType: CategoryOptionGroupSet.aggregationType
    allItems: boolean
    attributeValues: Array<AttributeValue>
    categoryOptionGroups: Array<CategoryOptionGroup>
    code: string
    created: string
    createdBy: User
    dataDimension: boolean
    dataDimensionType: CategoryOptionGroupSet.dataDimensionType
    description: string
    dimension: string
    dimensionItemKeywords: DimensionItemKeywords
    displayDescription: string
    displayFormName: string
    displayName: string
    displayShortName: string
    favorite: boolean
    favorites: Array<string>
    filter: string
    formName: string
    href: string
    id: string
    items: Array<DimensionalItemObject>
    lastUpdated: string
    lastUpdatedBy: User
    legendSet: LegendSet
    name: string
    optionSet: OptionSet
    programStage: ProgramStage
    repetition: EventRepetition
    sharing: Sharing
    shortName: string
    translations: Array<Translation>
    user: User
    valueType: CategoryOptionGroupSet.valueType
}

export namespace CategoryOptionGroupSet {
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

    export enum dataDimensionType {
        DISAGGREGATION = 'DISAGGREGATION',
        ATTRIBUTE = 'ATTRIBUTE',
    }

    export enum valueType {
        TEXT = 'TEXT',
        LONG_TEXT = 'LONG_TEXT',
        MULTI_TEXT = 'MULTI_TEXT',
        LETTER = 'LETTER',
        PHONE_NUMBER = 'PHONE_NUMBER',
        EMAIL = 'EMAIL',
        BOOLEAN = 'BOOLEAN',
        TRUE_ONLY = 'TRUE_ONLY',
        DATE = 'DATE',
        DATETIME = 'DATETIME',
        TIME = 'TIME',
        NUMBER = 'NUMBER',
        UNIT_INTERVAL = 'UNIT_INTERVAL',
        PERCENTAGE = 'PERCENTAGE',
        INTEGER = 'INTEGER',
        INTEGER_POSITIVE = 'INTEGER_POSITIVE',
        INTEGER_NEGATIVE = 'INTEGER_NEGATIVE',
        INTEGER_ZERO_OR_POSITIVE = 'INTEGER_ZERO_OR_POSITIVE',
        TRACKER_ASSOCIATE = 'TRACKER_ASSOCIATE',
        USERNAME = 'USERNAME',
        COORDINATE = 'COORDINATE',
        ORGANISATION_UNIT = 'ORGANISATION_UNIT',
        REFERENCE = 'REFERENCE',
        AGE = 'AGE',
        URL = 'URL',
        FILE_RESOURCE = 'FILE_RESOURCE',
        IMAGE = 'IMAGE',
        GEOJSON = 'GEOJSON',
    }
}
