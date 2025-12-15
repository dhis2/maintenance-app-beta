import i18n from '@dhis2/d2-i18n'

export const featureTypeOptions = [
    {
        value: '',
        label: i18n.t('<No value>'),
    },
    {
        value: 'NONE',
        label: i18n.t('None'),
    },
    {
        value: 'POINT',
        label: i18n.t('Point'),
    },
    {
        value: 'POLYGON',
        label: i18n.t('Polygon'),
    },
]
