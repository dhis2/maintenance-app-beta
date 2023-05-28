/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ObjectValueTypeRenderingOption = {
    clazz: string
    hasOptionSet: boolean
    renderingTypes: Array<
        | 'DEFAULT'
        | 'DROPDOWN'
        | 'VERTICAL_RADIOBUTTONS'
        | 'HORIZONTAL_RADIOBUTTONS'
        | 'VERTICAL_CHECKBOXES'
        | 'HORIZONTAL_CHECKBOXES'
        | 'SHARED_HEADER_RADIOBUTTONS'
        | 'ICONS_AS_BUTTONS'
        | 'SPINNER'
        | 'ICON'
        | 'TOGGLE'
        | 'VALUE'
        | 'SLIDER'
        | 'LINEAR_SCALE'
        | 'AUTOCOMPLETE'
        | 'QR_CODE'
        | 'BAR_CODE'
        | 'GS1_DATAMATRIX'
        | 'CANVAS'
    >
    valueType: ObjectValueTypeRenderingOption.valueType
}

export namespace ObjectValueTypeRenderingOption {
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
