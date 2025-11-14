import i18n from '@dhis2/d2-i18n'
import { SectionedFormDescriptor } from '../../../lib'
import { ProgramIndicatorValues } from './fieldFilters'

export const ProgramIndicatorFormDescriptor = {
    name: 'ProgramIndicatorsForm',
    label: i18n.t('Program Indicators Form'),
    sections: [
        {
            name: 'basicInformation',
            label: i18n.t('Basic information'),
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
                    label: i18n.t('Visual configuration'),
                },
            ],
        },
        {
            name: 'configuration',
            label: i18n.t('Configuration'),
            fields: [
                {
                    name: 'program',
                    label: i18n.t('Program'),
                },
                {
                    name: 'aggregationType',
                    label: i18n.t('Aggregation type'),
                },
                {
                    name: 'analyticsType',
                    label: i18n.t('Analytics type'),
                },
                {
                    name: 'orgUnitField',
                    label: i18n.t('Organisation unit field'),
                },
                {
                    name: 'decimals',
                    label: i18n.t('Decimals in data output'),
                },
            ],
        },
        {
            name: 'expression',
            label: i18n.t('Expression'),
            fields: [
                {
                    name: 'expression',
                    label: i18n.t('Expression'),
                },
            ],
        },
        {
            name: 'filter',
            label: i18n.t('Filter'),
            fields: [
                {
                    name: 'filter',
                    label: i18n.t('Filter'),
                },
            ],
        },
        {
            name: 'periodBoundaries',
            label: i18n.t('Period boundaries'),
            fields: [
                {
                    name: 'analyticsPeriodBoundaries',
                    label: i18n.t('Period boundaries'),
                },
            ],
        },
        {
            name: 'advancedOptions',
            label: i18n.t('Advanced options'),
            fields: [
                {
                    name: 'displayInForm',
                    label: i18n.t(
                        'Show program indicators in data entry forms'
                    ),
                },
                {
                    name: 'aggregateExportCategoryOptionCombo',
                    label: i18n.t(
                        'Category option combination for aggregate data export'
                    ),
                },
                {
                    name: 'aggregateExportAttributeOptionCombo',
                    label: i18n.t(
                        'Attribute option combination for aggregate data export'
                    ),
                },
                {
                    name: 'aggregateExportDataElement',
                    label: i18n.t('Data element for aggregate data export'),
                },
            ],
        },
        {
            name: 'legends',
            label: i18n.t('Legends'),
            fields: [
                {
                    name: 'legendSets',
                    label: i18n.t('Legend sets'),
                },
            ],
        },
    ],
} as const satisfies SectionedFormDescriptor<ProgramIndicatorValues>
