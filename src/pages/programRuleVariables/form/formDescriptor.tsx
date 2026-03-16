import i18n from '@dhis2/d2-i18n'
import { SectionedFormDescriptor } from '../../../lib'
import { ProgramRuleVariableFormValues } from './fieldFilters'

export const ProgramRuleVariableFormDescriptor = {
    name: 'ProgramRuleVariable',
    label: i18n.t('Program Rule Variable'),
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
                    name: 'program',
                    label: i18n.t('Program'),
                },
                {
                    name: 'useCodeForOptionSet',
                    label: i18n.t('Use code for option set'),
                },
            ],
        },
        {
            name: 'configuration',
            label: i18n.t('Configuration'),
            fields: [
                {
                    name: 'programRuleVariableSourceType',
                    label: i18n.t('Source type'),
                },
                {
                    name: 'programStage',
                    label: i18n.t('Program stage'),
                },
                {
                    name: 'dataElement',
                    label: i18n.t('Data element'),
                },
                {
                    name: 'trackedEntityAttribute',
                    label: i18n.t('Tracked entity attribute'),
                },
                {
                    name: 'valueType',
                    label: i18n.t('Value type'),
                },
            ],
        },
    ],
} as const satisfies SectionedFormDescriptor<ProgramRuleVariableFormValues>
