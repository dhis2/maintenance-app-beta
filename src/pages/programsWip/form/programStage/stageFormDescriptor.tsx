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
            fields: [
                {
                    name: 'repeatable',
                    label: i18n.t(
                        'Allow multiple events in this stage (repeatable stage)'
                    ),
                },
                {
                    name: 'standardInterval',
                    label: i18n.t('Standard interval days'),
                },
                {
                    name: 'generatedByEnrollmentDate',
                    label: i18n.t('Generate events based on enrollment date'),
                },
                {
                    name: 'autoGenerateEvent',
                    label: i18n.t('Auto-generate an event in this stage'),
                },
                {
                    name: 'openAfterEnrollment',
                    label: i18n.t('Open data entry form after enrollment'),
                },
                {
                    name: 'reportDateToUse',
                    label: i18n.t('Report date to use'),
                },
                {
                    name: 'minDaysFromStart',
                    label: i18n.t('Scheduled days from start'),
                },
                {
                    name: 'hideDueDate',
                    label: i18n.t('Show due date'),
                },
                {
                    name: 'periodType',
                    label: i18n.t('Period type'),
                },
                {
                    name: 'nextScheduleDate',
                    label: i18n.t('Default next scheduled date'),
                },
                {
                    name: 'allowGenerateNextVisit',
                    label: i18n.t(
                        'On event completion, show a prompt to create a new event'
                    ),
                },
                {
                    name: 'remindCompleted',
                    label: i18n.t(
                        'On event completion, ask user to complete program'
                    ),
                },
            ],
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
