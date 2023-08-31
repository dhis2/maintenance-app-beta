import i18n from '@dhis2/d2-i18n'

const translations: { [key: string]: string } = {
    SUM: i18n.t('Sum'),
    AVERAGE: i18n.t('Average'),
    AVERAGE_SUM_ORG_UNIT: i18n.t('Average (sum in org unit hierarchy)'),
    LAST_LAST_ORG_UNIT: i18n.t('Last value (sum in org unit hierarchy)'),
    LAST_AVERAGE_ORG_UNIT: i18n.t('Last value (average in org unit hierarchy)'),
    LAST_IN_PERIOD: i18n.t('Last value in period (sum in org unit hierarchy)'),
    LAST_IN_PERIOD_AVERAGE_ORG_UNIT: i18n.t(
        'Last value in period (average in org unit hierarchy)'
    ),
    FIRST_FIRST_ORG_UNIT: i18n.t('First value (sum in org unit hierarchy)'),
    FIRST_AVERAGE_ORG_UNIT: i18n.t(
        'First value (averge in org unit hierarchy)'
    ),
    COUNT: i18n.t('Count'),
    STDDEV: i18n.t('Standard deviation'),
    VARIANCE: i18n.t('Variance'),
    MIN: i18n.t('Min'),
    MAX: i18n.t('Max'),
    NON: i18n.t('None'),
    CUSTOM: i18n.t('Custom'),
    DEFAULT: i18n.t('Default'),
}

export function translateAggregationType(valueType: string) {
    return translations[valueType] || valueType
}
