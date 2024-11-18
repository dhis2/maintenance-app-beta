import i18n from '@dhis2/d2-i18n'

// because of the way d2-i18n works, we cannot translate dynamic values
// so we have to list them manually
export const AGGREGATION_TYPE = {
    SUM: i18n.t('Sum'),
    AVERAGE: i18n.t('Average'),
    AVERAGE_SUM_ORG_UNIT: i18n.t('Average (sum in org unit)'),
    LAST: i18n.t('Last value (sum in org unit hierarchy)'),
    LAST_AVERAGE_ORG_UNIT: i18n.t('Last value (average in org unit)'),
    LAST_LAST_ORG_UNIT: i18n.t('Last value (last in org unit hierarchy)'),
    LAST_IN_PERIOD: i18n.t('Last value in period (sum in org unit hierarchy)'),
    LAST_IN_PERIOD_AVERAGE_ORG_UNIT: i18n.t('Lastinperiodaverageorgunit'),
    FIRST: i18n.t('First value (sum in org unit hierarchy)'),
    FIRST_AVERAGE_ORG_UNIT: i18n.t(
        'First value (average in org unit hierarchy)'
    ),
    FIRST_FIRST_ORG_UNIT: i18n.t('First value (first in org unit hierarchy)'),
    COUNT: i18n.t('Count'),
    STDDEV: i18n.t('Standard deviation'),
    VARIANCE: i18n.t('Variance'),
    MIN: i18n.t('Min'),
    MAX: i18n.t('Max'),
    MIN_SUM_ORG_UNIT: i18n.t('Min (sum in org unit)'),
    MAX_SUM_ORG_UNIT: i18n.t('Max (sum in org unit)'),
    NONE: i18n.t('None'),
    CUSTOM: i18n.t('Custom'),
    DEFAULT: i18n.t('Default'),
}

export const DOMAIN_TYPE = {
    AGGREGATE: i18n.t('Aggregate'),
    TRACKER: i18n.t('Tracker'),
}

export const VALUE_TYPE = {
    TEXT: i18n.t('Text'),
    LONG_TEXT: i18n.t('Long text'),
    MULTI_TEXT: i18n.t('Text with multiple values'),
    LETTER: i18n.t('Letter'),
    PHONE_NUMBER: i18n.t('Phone number'),
    EMAIL: i18n.t('Email'),
    BOOLEAN: i18n.t('Yes/No'),
    TRUE_ONLY: i18n.t('Yes only'),
    DATE: i18n.t('Date'),
    DATETIME: i18n.t('Date and time'),
    TIME: i18n.t('Time'),
    NUMBER: i18n.t('Number'),
    UNIT_INTERVAL: i18n.t('Unit interval'),
    PERCENTAGE: i18n.t('Percentage'),
    INTEGER: i18n.t('Integer'),
    INTEGER_POSITIVE: i18n.t('Positive integer'),
    INTEGER_NEGATIVE: i18n.t('Negative integer'),
    INTEGER_ZERO_OR_POSITIVE: i18n.t('Positive or Zero integer'),
    TRACKER_ASSOCIATE: i18n.t('Tracker associate'),
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

export const DATA_DIMENSION_TYPE = {
    DISAGGREGATION: i18n.t('Disaggregation'),
    ATTRIBUTE: i18n.t('Attribute'),
}

export const GEOMETRY_TYPE = {
    POINT: i18n.t('Point'),
    MULTIPOINT: i18n.t('MultiPoint'),
    LINESTRING: i18n.t('LineString'),
    MULTILINESTRING: i18n.t('MultiLineString'),
    POLYGON: i18n.t('Polygon'),
    MULTIPOLYGON: i18n.t('MultiPolygon'),
    GEOMETRYCOLLECTION: i18n.t('GeometryCollection'),
}

export const FORM_TYPE = {
    CUSTOM: i18n.t('Custom'),
    DEFAULT: i18n.t('Default'),
    SECTION: i18n.t('Section'),
    SECTION_MULTIORG: i18n.t('Section Multi-org'),
}

const allConstantTranslations: Record<string, string> = {
    ...AGGREGATION_TYPE,
    ...DOMAIN_TYPE,
    ...VALUE_TYPE,
    ...DATA_DIMENSION_TYPE,
    ...GEOMETRY_TYPE,
    ...FORM_TYPE,
}

export const getConstantTranslation = (constant: string): string => {
    return allConstantTranslations[constant] || constant
}
