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
    ],
} as const satisfies SectionedFormDescriptor<ProgramValues>
