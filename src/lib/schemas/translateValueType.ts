import i18n from '@dhis2/d2-i18n'

const translations: { [key: string]: string } = {
    MULTI_TEXT: i18n.t('MULTI_TEXT'),
    TEXT: i18n.t('Text'),
    LONG_TEXT: i18n.t('Long text'),
    LETTER: i18n.t('Letter'),
    PHONE_NUMBER: i18n.t('Phone number'),
    EMAIL: i18n.t('Email'),
    BOOLEAN: i18n.t('Yes/No'),
    TRUE_ONLY: i18n.t('Yes Only'),
    DATE: i18n.t('Date'),
    DATETIME: i18n.t('Date & Time'),
    TIME: i18n.t('Time'),
    NUMBER: i18n.t('Number'),
    UNIT_INTERVAL: i18n.t('Unit interval'),
    PERCENTAGE: i18n.t('Percentage'),
    INTEGER: i18n.t('Integer'),
    INTEGER_POSITIVE: i18n.t('Positive Integer'),
    INTEGER_NEGATIVE: i18n.t('Negative Integer'),
    INTEGER_ZERO_OR_POSITIVE: i18n.t('Positive or Zero Integer'),
    TRACKER_ASSOCIATE: i18n.t('Tracker Associate'),
    USERNAME: i18n.t('Username'),
    COORDINATE: i18n.t('Coordinate'),
    ORGANISATION_UNIT: i18n.t('Organisation unit'),
    REFERENCE: i18n.t('Reference'),
    AGE: i18n.t('Age'),
    URL: i18n.t('URL'),
    FILE_RESOURCE: i18n.t('File'),
    IMAGE: i18n.t('Image'),
    GEOJSON: i18n.t('GeoJSON'),
}

export function translateValueType(valueType: string) {
    return translations[valueType] || valueType
}
