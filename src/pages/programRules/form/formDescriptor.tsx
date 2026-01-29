import i18n from '@dhis2/d2-i18n'
import { SectionedFormDescriptor } from '../../../lib'
import { ProgramRuleFormValues } from './fieldFilters'

export const ProgramRuleFormDescriptor = {
    name: 'ProgramRule',
    label: i18n.t('Program Rule'),
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
                    name: 'description',
                    label: i18n.t('Description'),
                },
                {
                    name: 'program',
                    label: i18n.t('Program'),
                },
                {
                    name: 'priority',
                    label: i18n.t('Priority'),
                },
            ],
        },
    ],
} as const satisfies SectionedFormDescriptor<ProgramRuleFormValues>
