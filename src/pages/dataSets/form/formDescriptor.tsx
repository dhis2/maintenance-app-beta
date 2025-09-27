import i18n from '@dhis2/d2-i18n'
import { SectionedFormDescriptor } from '../../../lib'
import { DataSetValues } from '../Edit'

export const DataSetFormDescriptor = {
    name: 'DataSet',
    label: 'Data Set',
    sections: [
        {
            name: 'setup',
            label: i18n.t('Setup'),
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
            name: 'data',
            label: i18n.t('Data'),
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
            name: 'periods',
            label: i18n.t('Periods'),
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
        { name: 'validation', label: i18n.t('Validation'), fields: [] },
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
            name: 'form',
            label: i18n.t('Form'),
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
} as const satisfies SectionedFormDescriptor<DataSetValues>
