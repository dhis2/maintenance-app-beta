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
            fields: [{ name: 'name', label: i18n.t('Name') }],
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
