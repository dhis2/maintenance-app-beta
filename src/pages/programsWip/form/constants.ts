import i18n from '@dhis2/d2-i18n'
import { getConstantTranslation } from '../../../lib'

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

export const validationStrategyOptions = [
    {
        value: 'ON_COMPLETE',
        label: getConstantTranslation('ON_COMPLETE'),
    },
    {
        value: 'ON_UPDATE_AND_INSERT',
        label: getConstantTranslation('ON_UPDATE_AND_INSERT'),
    },
]
