/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { Program } from './Program'
import type { TrackedEntityAttribute } from './TrackedEntityAttribute'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type ProgramTrackedEntityAttribute = {
    access: Access
    allowFutureDate: boolean
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    displayInList: boolean
    displayName: string
    displayShortName: string
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    mandatory: boolean
    program: Program
    renderOptionsAsRadio: boolean
    /**
     * The exact type is unknown.
     * (Java type was: `org.hisp.dhis.render.DeviceRenderTypeMap<org.hisp.dhis.render.type.ValueTypeRenderingObject>`)
     */
    renderType: any
    searchable: boolean
    sharing: Sharing
    sortOrder: number
    trackedEntityAttribute: TrackedEntityAttribute
    translations: Array<Translation>
    user: User
    valueType: ProgramTrackedEntityAttribute.valueType
}

export namespace ProgramTrackedEntityAttribute {
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
