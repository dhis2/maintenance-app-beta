import i18n from '@dhis2/d2-i18n'
import { SectionedFormDescriptor } from '../../../lib'
import { ProgramIndicatorValues } from './fieldFilters'

export const ProgramIndicatorFormDescriptor = {
    name: 'ProgramIndicatorsForm',
    label: i18n.t('Program Indicators Form'),
    sections: [
        {
            name: 'setup',
            label: i18n.t('Setup'),
            fields: [
                {
                    name: 'program',
                    label: i18n.t('Program'),
                },
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
                    name: 'style',
                    label: i18n.t('Color and icon'),
                },
                {
                    name: 'description',
                    label: i18n.t('Description'),
                },
                {
                    name: 'decimals',
                    label: i18n.t('Decimals in data output'),
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
                    name: 'displayInForm',
                    label: i18n.t('Display in form'),
                },
                {
                    name: 'legendSets',
                    label: i18n.t('Legend sets'),
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
            name: 'editExpression',
            label: i18n.t('Edit expression'),
            fields: [
                {
                    name: 'expression',
                    label: i18n.t('Expression'),
                },
            ],
        },
        {
            name: 'editFilter',
            label: i18n.t('Edit filter'),
            fields: [
                {
                    name: 'filter',
                    label: i18n.t('Filter'),
                },
            ],
        },
    ],
} as const satisfies SectionedFormDescriptor<ProgramIndicatorValues>
