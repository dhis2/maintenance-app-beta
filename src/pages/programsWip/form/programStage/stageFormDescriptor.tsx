import i18n from '@dhis2/d2-i18n'
import { SectionedFormDescriptor } from '../../../../lib'
import { StageFormValues } from './StageForm'

export const StageFormDescriptor = {
    name: 'Program Stage',
    label: 'Program Stage',
    sections: [
        {
            name: 'stageSetup',
            label: i18n.t('Stage: Setup', { nsSeparator: '~:~' }),
            fields: [
                { name: 'name', label: i18n.t('Name') },
                { name: 'description', label: i18n.t('Description') },
                { name: 'style', label: i18n.t('Visual configuration') },
            ],
        },
        {
            name: 'stageConfiguration',
            label: i18n.t('Stage: Configuration', { nsSeparator: '~:~' }),
            fields: [
                {
                    name: 'enableUserAssignment',
                    label: i18n.t('Allow user assignment of events'),
                },
                { name: 'featureType', label: i18n.t('Feature type') },
                {
                    name: 'validationStrategy',
                    label: i18n.t('Validation strategy'),
                },
                {
                    name: 'preGenerateUID',
                    label: i18n.t('Pre-generate event UID'),
                },
            ],
        },
        {
            name: 'stageTerminology',
            label: i18n.t('Stage: Terminology', { nsSeparator: '~:~' }),
            fields: [
                {
                    name: 'executionDateLabel',
                    label: i18n.t('Custom label for report date'),
                },
                {
                    name: 'dueDateLabel',
                    label: i18n.t('Custom label for due date'),
                },
                {
                    name: 'programStageLabel',
                    label: i18n.t('Custom label for program stage'),
                },
                {
                    name: 'eventLabel',
                    label: i18n.t('Custom label for event'),
                },
            ],
        },
        {
            name: 'stageCreationAndScheduling',
            label: i18n.t('Stage: Creation and Scheduling', {
                nsSeparator: '~:~',
            }),
            fields: [],
        },
        {
            name: 'stageData',
            label: i18n.t('Stage: Data', { nsSeparator: '~:~' }),
            fields: [],
        },
        {
            name: 'stageForm',
            label: i18n.t('Stage: Form', { nsSeparator: '~:~' }),
            fields: [],
        },
    ],
} as const satisfies SectionedFormDescriptor<StageFormValues>
