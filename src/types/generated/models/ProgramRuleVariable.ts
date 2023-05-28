/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { DataElement } from './DataElement'
import type { Program } from './Program'
import type { ProgramStage } from './ProgramStage'
import type { TrackedEntityAttribute } from './TrackedEntityAttribute'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type ProgramRuleVariable = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    dataElement: DataElement
    displayName: string
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    program: Program
    programRuleVariableSourceType: ProgramRuleVariable.programRuleVariableSourceType
    programStage: ProgramStage
    sharing: Sharing
    trackedEntityAttribute: TrackedEntityAttribute
    translations: Array<Translation>
    useCodeForOptionSet: boolean
    user: User
    valueType: ProgramRuleVariable.valueType
}

export namespace ProgramRuleVariable {
    export enum programRuleVariableSourceType {
        DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE = 'DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE',
        DATAELEMENT_NEWEST_EVENT_PROGRAM = 'DATAELEMENT_NEWEST_EVENT_PROGRAM',
        DATAELEMENT_CURRENT_EVENT = 'DATAELEMENT_CURRENT_EVENT',
        DATAELEMENT_PREVIOUS_EVENT = 'DATAELEMENT_PREVIOUS_EVENT',
        CALCULATED_VALUE = 'CALCULATED_VALUE',
        TEI_ATTRIBUTE = 'TEI_ATTRIBUTE',
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
