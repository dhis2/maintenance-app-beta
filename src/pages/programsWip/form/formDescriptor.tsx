import i18n from '@dhis2/d2-i18n'
import { SectionedFormDescriptor } from '../../../lib'
import { ProgramValues } from '../Edit'

export const ProgramFormDescriptor = {
    name: 'Program',
    label: 'Program',
    sections: [
        {
            name: 'enrollmentDetails',
            label: i18n.t('Program Details'),
            fields: [
                { name: 'name', label: i18n.t('Name') },
                { name: 'shortName', label: i18n.t('Short name') },
                { name: 'code', label: i18n.t('Code') },
                { name: 'description', label: i18n.t('Description') },
                { name: 'version', label: i18n.t('Version') },
                { name: 'featureType', label: i18n.t('Feature type') },
                { name: 'relatedProgram', label: i18n.t('Related program') },
                {
                    name: 'categoryCombo',
                    label: i18n.t('Category combination'),
                },
            ],
        },
        {
            name: 'programCustomization',
            label: i18n.t('Program Customization'),
            fields: [
                {
                    name: 'style',
                    label: i18n.t('Visual configuration'),
                },
                {
                    name: 'incidentDateLabel',
                    label: i18n.t('Custom label for "Incident date"'),
                },
                {
                    name: 'enrollmentDateLabel',
                    label: i18n.t('Custom label for "Enrollment date"'),
                },
                {
                    name: 'enrollmentLabel',
                    label: i18n.t('Custom label for "Enrollment"'),
                },
                {
                    name: 'eventLabel',
                    label: i18n.t('Custom label for "Event"'),
                },
                {
                    name: 'programStageLabel',
                    label: i18n.t('Custom label for "Program stage"'),
                },
                {
                    name: 'followUpLabel',
                    label: i18n.t('Custom label for "Follow-up"'),
                },
                {
                    name: 'orgUnitLabel',
                    label: i18n.t('Custom label for "Registering unit"'),
                },
                {
                    name: 'relationshipLabel',
                    label: i18n.t('Custom label for "Relationship"'),
                },
                { name: 'noteLabel', label: i18n.t('Custom label for "Note"') },
                {
                    name: 'displayFrontPageList',
                    label: i18n.t(
                        'Display enrolled TEs in the front page list'
                    ),
                },
            ],
        },
        {
            name: 'enrollmentSettings',
            label: i18n.t('Enrollment: Settings', { nsSeparator: '~:~' }),
            fields: [
                {
                    name: 'trackedEntityType',
                    label: i18n.t('Tracked entity type'),
                },
                {
                    name: 'onlyEnrollOnce',
                    label: i18n.t('Only allow one enrollment'),
                },
                {
                    name: 'selectEnrollmentDatesInFuture',
                    label: i18n.t('Allow enrollment dates in the future'),
                },
                {
                    name: 'displayIncidentDate',
                    label: i18n.t('Collect an incident date'),
                },
                {
                    name: 'selectIncidentDatesInFuture',
                    label: i18n.t('Allow incident dates in the future'),
                },
                {
                    name: 'useFirstStageDuringRegistration',
                    label: i18n.t(
                        'Collect data for the first stage during enrollment'
                    ),
                },
                {
                    name: 'ignoreOverdueEvents',
                    label: i18n.t(
                        'Do not create overdue events when automatically creating program stage events'
                    ),
                },
            ],
        },
        {
            name: 'enrollmentData',
            label: i18n.t('Enrollment: Data', { nsSeparator: '~:~' }),
            fields: [
                {
                    name: 'programTrackedEntityAttributes',
                    label: i18n.t('Tracked entity attributes'),
                },
            ],
        },
        {
            name: 'enrollmentForm',
            label: i18n.t('Enrollment: Form', { nsSeparator: '~:~' }),
            fields: [{ name: 'dataEntryForm', label: i18n.t('Custom form') }],
        },
        {
            name: 'programStages',
            label: i18n.t('Program Stages'),
            fields: [],
        },
        {
            name: 'programNotifications',
            label: i18n.t('Notifications'),
            fields: [],
        },
        {
            name: 'accessAndSharing',
            label: i18n.t('Access and Sharing'),
            fields: [
                {
                    name: 'organisationUnits',
                    label: i18n.t('Organisation units'),
                },
                {
                    name: 'sharing',
                    label: i18n.t('Role access'),
                },
            ],
        },
    ],
} as const satisfies SectionedFormDescriptor<ProgramValues>
