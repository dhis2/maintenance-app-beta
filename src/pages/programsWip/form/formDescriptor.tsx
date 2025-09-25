import i18n from '@dhis2/d2-i18n'
import { SectionedFormDescriptor } from '../../../lib'
import { ProgramsFromFilters } from '../Edit'

export const ProgramFormDescriptor = {
    name: 'Program',
    label: 'Program',
    sections: [
        {
            name: 'setup',
            label: i18n.t('Setup'),
            fields: [{ name: 'name', label: i18n.t('Name') }],
        },
        {
            name: 'enrollmentSettings',
            label: i18n.t('Enrollment: Settings'),
            fields: [
                {
                    name: 'trackedEntityType',
                    label: i18n.t('Tracked entity type'),
                },
            ],
        },
        {
            name: 'enrollmentData',
            label: i18n.t('Enrollment: Data'),
            fields: [
                {
                    name: 'programTrackedEntityAttributes',
                    label: i18n.t('Tracked entity attributes'),
                },
            ],
        },
        {
            name: 'enrollmentForm',
            label: i18n.t('Enrollment: Form'),
            fields: [{ name: 'dataEntryForm', label: i18n.t('Custom form') }],
        },
    ],
} as const satisfies SectionedFormDescriptor<ProgramsFromFilters>
