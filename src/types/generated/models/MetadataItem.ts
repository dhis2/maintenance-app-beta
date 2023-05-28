/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectStyle } from './ObjectStyle'
import type { IndicatorType } from './IndicatorType'

export type MetadataItem = {
    aggregationType: MetadataItem.aggregationType
    code: string
    description: string
    dimensionItemType: MetadataItem.dimensionItemType
    dimensionType: MetadataItem.dimensionType
    endDate: string
    expression: string
    indicatorType: IndicatorType
    legendSet: string
    name: string
    startDate: string
    style: ObjectStyle
    totalAggregationType: MetadataItem.totalAggregationType
    uid: string
    valueType: MetadataItem.valueType
}

export namespace MetadataItem {
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

    export enum dimensionType {
        DATA_X = 'DATA_X',
        PROGRAM_DATA_ELEMENT = 'PROGRAM_DATA_ELEMENT',
        PROGRAM_ATTRIBUTE = 'PROGRAM_ATTRIBUTE',
        PROGRAM_INDICATOR = 'PROGRAM_INDICATOR',
        DATA_COLLAPSED = 'DATA_COLLAPSED',
        CATEGORY_OPTION_COMBO = 'CATEGORY_OPTION_COMBO',
        ATTRIBUTE_OPTION_COMBO = 'ATTRIBUTE_OPTION_COMBO',
        PERIOD = 'PERIOD',
        ORGANISATION_UNIT = 'ORGANISATION_UNIT',
        CATEGORY_OPTION_GROUP_SET = 'CATEGORY_OPTION_GROUP_SET',
        DATA_ELEMENT_GROUP_SET = 'DATA_ELEMENT_GROUP_SET',
        ORGANISATION_UNIT_GROUP_SET = 'ORGANISATION_UNIT_GROUP_SET',
        ORGANISATION_UNIT_GROUP = 'ORGANISATION_UNIT_GROUP',
        CATEGORY = 'CATEGORY',
        OPTION_GROUP_SET = 'OPTION_GROUP_SET',
        VALIDATION_RULE = 'VALIDATION_RULE',
        STATIC = 'STATIC',
        ORGANISATION_UNIT_LEVEL = 'ORGANISATION_UNIT_LEVEL',
    }

    export enum totalAggregationType {
        SUM = 'SUM',
        AVERAGE = 'AVERAGE',
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
