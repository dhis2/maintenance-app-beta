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
                    name: 'generator.expression',
                    label: i18n.t('Left side expression'),
                },
                {
                    name: 'generator.missingValueStrategy',
                    label: i18n.t('Left side missing value strategy'),
                },
                {
                    name: 'generator.slidingWindow',
                    label: i18n.t('Left side sliding window'),
                },
            ],
        },
        {
            name: 'predictionLogic',
            label: i18n.t('Prediction logic'),
            fields: [],
        },
    ],
} as const satisfies SectionedFormDescriptor<PredictorFormValues>
