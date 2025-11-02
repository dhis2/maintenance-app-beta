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

export const ANALYTICS_TYPE = {
    EVENT: i18n.t('Event'),
    ENROLLMENT: i18n.t('Enrollment'),
}

const PERIOD_TYPE = {
    BiMonthly: i18n.t('BiMonthly'),
    BiWeekly: i18n.t('BiWeekly'),
    Daily: i18n.t('Daily'),
    FinancialApril: i18n.t('FinancialApril'),
    FinancialJuly: i18n.t('FinancialJuly'),
    FinancialNov: i18n.t('FinancialNov'),
    FinancialOct: i18n.t('FinancialOct'),
    Monthly: i18n.t('Monthly'),
    Quarterly: i18n.t('Quarterly'),
    QuarterlyNov: i18n.t('QuarterlyNov'),
    SixMonthlyApril: i18n.t('SixMonthlyApril'),
    SixMonthlyNov: i18n.t('SixMonthlyNov'),
    SixMonthly: i18n.t('SixMonthly'),
    TwoYearly: i18n.t('TwoYearly'),
    Weekly: i18n.t('Weekly'),
    WeeklySaturday: i18n.t('WeeklySaturday'),
    WeeklySunday: i18n.t('WeeklySunday'),
    WeeklyThursday: i18n.t('WeeklyThursday'),
    WeeklyWednesday: i18n.t('WeeklyWednesday'),
    Yearly: i18n.t('Yearly'),
}

const SEND_STRATEGY = {
    COLLECTIVE_SUMMARY: i18n.t('Collective summary'),
    SINGLE_NOTIFICATION: i18n.t('Single notification'),
}

const DATA_SET_NOTIFICATION_TRIGGER = {
    SCHEDULED_DAYS: i18n.t('Scheduled days'),
    DATA_SET_COMPLETION: i18n.t('Data set completion'),
}

const NOTIFICATION_RECIPIENT = {
    ORGANISATION_UNIT_CONTACT: i18n.t('Organisation unit contact'),
    USER_GROUP: i18n.t('User group'),
}

const RENDERING_TYPE = {
    DEFAULT: i18n.t('Default'),
    DROPDOWN: i18n.t('Dropdown'),
    VERTICAL_RADIOBUTTONS: i18n.t('Vertical radiobuttons'),
    HORIZONTAL_RADIOBUTTONS: i18n.t('Horizontal radiobuttons'),
    VERTICAL_CHECKBOXES: i18n.t('Vertical checkboxes'),
    HORIZONTAL_CHECKBOXES: i18n.t('Horizontal checkboxes'),
    SHARED_HEADER_RADIOBUTTONS: i18n.t('Shared header radiobuttons'),
    ICONS_AS_BUTTONS: i18n.t('Icons as buttons'),
    SPINNER: i18n.t('Spinner'),
    ICON: i18n.t('Icon'),
    TOGGLE: i18n.t('Toggle'),
    VALUE: i18n.t('Value'),
    SLIDER: i18n.t('Slider'),
    LINEAR_SCALE: i18n.t('Linear scale'),
    AUTOCOMPLETE: i18n.t('Autocomplete'),
    QR_CODE: i18n.t('Qr code'),
    BAR_CODE: i18n.t('Bar code'),
    GS1_DATAMATRIX: i18n.t('Gs1 datamatrix'),
    CANVAS: i18n.t('Canvas'),
}

const allConstantTranslations: Record<string, string> = {
    ...AGGREGATION_TYPE,
    ...ANALYTICS_TYPE,
    ...DOMAIN_TYPE,
    ...VALUE_TYPE,
    ...DATA_DIMENSION_TYPE,
    ...GEOMETRY_TYPE,
    ...FORM_TYPE,
    ...PERIOD_TYPE,
    ...RENDERING_TYPE,
    ...SEND_STRATEGY,
    ...DATA_SET_NOTIFICATION_TRIGGER,
    ...NOTIFICATION_RECIPIENT,
}

export const getConstantTranslation = (constant: string): string => {
    return allConstantTranslations[constant] || constant
}
