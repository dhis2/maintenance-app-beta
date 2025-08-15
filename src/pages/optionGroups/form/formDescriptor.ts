import i18n from '@dhis2/d2-i18n'
import { SectionedFormDescriptor } from '../../../lib'
import { OptionGroupFormValues } from './OptionGroupFormSchema'

export const OptionGroupFormDescriptor = {
    name: 'OptionGroupForm',
    label: i18n.t('Option Group Form'),
    sections: [
        {
            name: 'basicInformation',
            label: i18n.t('Basic information'),
            fields: [
                { name: 'name', label: i18n.t('Name') },
                { name: 'shortName', label: i18n.t('Short name') },
                { name: 'code', label: i18n.t('Code') },
                { name: 'description', label: i18n.t('Description') },
                { name: 'style', label: i18n.t('Color and icon') },
            ],
        },
        {
            name: 'options',
            label: i18n.t('Options'),
            fields: [
                { name: 'optionSet', label: i18n.t('Option Set') },
                { name: 'options', label: i18n.t('Options') },
            ],
        },
    ],
} as const satisfies SectionedFormDescriptor<OptionGroupFormValues>
