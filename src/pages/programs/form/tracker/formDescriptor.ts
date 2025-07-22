import i18n from '@dhis2/d2-i18n'
import { SectionedFormDescriptor } from '../../../../lib'

export const TrackerProgramFormDescriptor = {
    name: 'TrackerProgram',
    label: i18n.t('Programs'),
    sections: [
        {
            name: 'basic',
            label: i18n.t('Basic Information'),
            fields: [
                {
                    name: 'name',
                    label: i18n.t('Name'),
                },
                {
                    name: 'shortName',
                    label: i18n.t('Short name'),
                },
                {
                    name: 'code',
                    label: i18n.t('Code'),
                },
                {
                    name: 'description',
                    label: i18n.t('Description'),
                },
                {
                    name: 'style',
                    label: i18n.t('Color and icon'),
                },
            ],
        },
        {
            name: 'enrollment',
            label: i18n.t('Enrollment'),
            fields: [
                {
                    name: 'dataElements',
                    label: i18n.t('Data Elements'),
                },
                {
                    name: 'categoryCombo',
                    label: 'Category Combination',
                },
                {
                    name: 'indicators',
                    label: i18n.t('Indicators'),
                },
            ],
        },
        {
            name: 'options',
            label: i18n.t('Options'),
            fields: [
                {
                    name: 'periodType',
                    label: i18n.t('Period type'),
                },
                {
                    name: 'openFuturePeriods',
                    label: i18n.t('Allow data entry for future periods'),
                },
                {
                    name: 'expiryDays',
                    label: i18n.t(
                        'Close data entry a certain number of days after period end'
                    ),
                },
                {
                    name: 'openPeriodsAfterCoEndDate',
                    label: i18n.t(
                        'Close data entry after category option end date'
                    ),
                },
            ],
        },
        { name: 'stages', label: i18n.t('Stages'), fields: [] },
        {
            name: 'organisationUnits',
            label: i18n.t('Organisation Units'),
            fields: [
                {
                    name: 'organisationUnits',
                    label: i18n.t('Organisation units'),
                },
            ],
        },
        {
            name: 'acces',
            label: i18n.t('Access and sharing'),
            fields: [
                {
                    name: 'formType',
                    label: i18n.t('Form type'),
                },
                {
                    name: 'displayOptions',
                    label: i18n.t('Display Options'),
                },
            ],
        },
        { name: 'advanced', label: i18n.t('Advanced'), fields: [] },
    ],
} as const satisfies SectionedFormDescriptor
