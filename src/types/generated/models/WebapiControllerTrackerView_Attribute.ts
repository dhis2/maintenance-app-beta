/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UID_WebapiControllerTrackerView_Attribute } from './UID_WebapiControllerTrackerView_Attribute'

export type WebapiControllerTrackerView_Attribute = {
    attribute: UID_WebapiControllerTrackerView_Attribute
    code: string
    createdAt: string | number
    displayName: string
    storedBy: string
    updatedAt: string | number
    value: string
    valueType: WebapiControllerTrackerView_Attribute.valueType
}

export namespace WebapiControllerTrackerView_Attribute {
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
