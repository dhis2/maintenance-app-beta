import i18n from '@dhis2/d2-i18n'
import { SectionedFormDescriptor } from '../../../lib'

export const OptionSetFormDescriptor = {
    name: 'OptionSet',
    label: i18n.t('Option Set'),
    sections: [
        {
            name: 'basicInfo',
            label: i18n.t('Basic information'),
            fields: [
                { name: 'name', label: i18n.t('Name') },
                { name: 'code', label: i18n.t('Code') },
                { name: 'description', label: i18n.t('Description') },
                { name: 'valueType', label: i18n.t('Value type') },
            ],
        },
        {
            name: 'options',
            label: i18n.t('Options'),
            fields: [{ name: 'options', label: i18n.t('Options') }],
        },
    ],
} as const satisfies SectionedFormDescriptor
