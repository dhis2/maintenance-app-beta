import i18n from '@dhis2/d2-i18n'
import { SectionedFormDescriptor } from '../../../lib'
import { PredictorFormValues } from '../Edit'

export const PredictorFormDescriptor = {
    name: 'PredictorForm',
    label: i18n.t('Predictor Form'),
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
            ],
        },
        {
            name: 'outputDefinition',
            label: i18n.t('Output definition'),
            fields: [
                {
                    name: 'output',
                    label: i18n.t('Output data element'),
                },
                {
                    name: 'outputCombo',
                    label: i18n.t('Output category combo'),
                },
                {
                    name: 'periodType',
                    label: i18n.t('Period type'),
                },
                {
                    name: 'organisationUnitLevels',
                    label: i18n.t('Organisation unit levels'),
                },
                {
                    name: 'organisationUnitDescendants',
                    label: i18n.t('Organisation unit descendants'),
                },
            ],
        },
        {
            name: 'predictionLogic',
            label: i18n.t('Prediction logic'),
            fields: [
                {
                    name: 'generator.expression',
                    label: i18n.t('Generator expression'),
                },
                {
                    name: 'generator.description',
                    label: i18n.t('Generator description'),
                },
                {
                    name: 'generator.missingValueStrategy',
                    label: i18n.t('Generator missing value strategy'),
                },
                {
                    name: 'sampleSkipTest.expression',
                    label: i18n.t('Generator expression'),
                },
                {
                    name: 'sampleSkipTest.description',
                    label: i18n.t('Generator description'),
                },
                {
                    name: 'sequentialSampleCount',
                    label: i18n.t('Sequential sample count'),
                },
                {
                    name: 'annualSampleCount',
                    label: i18n.t('Annual sample count'),
                },
                {
                    name: 'sequentialSkipCount',
                    label: i18n.t('Sequential skip count'),
                },
            ],
        },
    ],
} as const satisfies SectionedFormDescriptor<PredictorFormValues>
