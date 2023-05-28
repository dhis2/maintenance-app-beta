/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { OptionSet } from './OptionSet'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type Attribute = {
    access: Access
    attributeValues: Array<AttributeValue>
    categoryAttribute: boolean
    categoryOptionAttribute: boolean
    categoryOptionComboAttribute: boolean
    categoryOptionGroupAttribute: boolean
    categoryOptionGroupSetAttribute: boolean
    code: string
    constantAttribute: boolean
    created: string
    createdBy: User
    dataElementAttribute: boolean
    dataElementGroupAttribute: boolean
    dataElementGroupSetAttribute: boolean
    dataSetAttribute: boolean
    description: string
    displayDescription: string
    displayFormName: string
    displayName: string
    displayShortName: string
    documentAttribute: boolean
    eventChartAttribute: boolean
    eventReportAttribute: boolean
    favorite: boolean
    favorites: Array<string>
    formName: string
    href: string
    id: string
    indicatorAttribute: boolean
    indicatorGroupAttribute: boolean
    lastUpdated: string
    lastUpdatedBy: User
    legendSetAttribute: boolean
    mandatory: boolean
    mapAttribute: boolean
    name: string
    objectTypes: Array<string>
    optionAttribute: boolean
    optionSet: OptionSet
    optionSetAttribute: boolean
    organisationUnitAttribute: boolean
    organisationUnitGroupAttribute: boolean
    organisationUnitGroupSetAttribute: boolean
    programAttribute: boolean
    programIndicatorAttribute: boolean
    programStageAttribute: boolean
    relationshipTypeAttribute: boolean
    sectionAttribute: boolean
    sharing: Sharing
    shortName: string
    sortOrder: number
    sqlViewAttribute: boolean
    trackedEntityAttributeAttribute: boolean
    trackedEntityTypeAttribute: boolean
    translations: Array<Translation>
    unique: boolean
    user: User
    userAttribute: boolean
    userGroupAttribute: boolean
    validationRuleAttribute: boolean
    validationRuleGroupAttribute: boolean
    valueType: Attribute.valueType
    visualizationAttribute: boolean
}

export namespace Attribute {
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
