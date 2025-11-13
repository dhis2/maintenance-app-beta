import i18n from '@dhis2/d2-i18n'
import { SectionedFormDescriptor } from '../../../lib'
import { TrackedEntityAttributeFormValues } from './TrackedEntityAttributeFormSchema'

export const TrackedEntityAttributeFormDescriptor = {
    name: 'TrackedEntityAttribute',
    label: i18n.t('Tracked Entity Attribute'),
    sections: [
        {
            name: 'basic',
            label: i18n.t('Basic information'),
            fields: [
                {
                    name: 'name',
                    label: i18n.t('Name'),
                },
                {
                    name: 'formName',
                    label: i18n.t('Form name'),
                },
                {
                    name: 'shortName',
                    label: i18n.t('Short name'),
                },
                {
                    name: 'code',
                    label: i18n.t('Code'),
                },
                {
                    name: 'description',
                    label: i18n.t('Description'),
                },
            ],
        },
        {
            name: 'dataCollection',
            label: i18n.t('Data collection'),
            fields: [
                {
                    name: 'optionSet',
                    label: i18n.t('Option set'),
                },
                {
                    name: 'valueType',
                    label: i18n.t('Value type'),
                },
                {
                    name: 'trackedEntityType',
                    label: i18n.t('Tracked entity type'),
                },
                {
                    name: 'unique',
                    label: i18n.t('Unique'),
                },
                {
                    name: 'orgunitScope',
                    label: i18n.t('Organisation unit scope'),
                },
                {
                    name: 'generated',
                    label: i18n.t('Generated'),
                },
                {
                    name: 'pattern',
                    label: i18n.t('Pattern'),
                },
                {
                    name: 'fieldMask',
                    label: i18n.t('Field mask'),
                },
            ],
        },
        {
            name: 'dataHandling',
            label: i18n.t('Data handling'),
            fields: [
                {
                    name: 'confidential',
                    label: i18n.t('Confidential'),
                },
                {
                    name: 'inherit',
                    label: i18n.t('Inherit'),
                },
                {
                    name: 'displayInListNoProgram',
                    label: i18n.t('Display in list'),
                },
                {
                    name: 'skipSynchronization',
                    label: i18n.t('Skip synchronization'),
                },
                // TODO: Uncomment when version control is implemented (v43+)
                // {
                //     name: 'trigramIndexable',
                //     label: i18n.t('Trigram indexable'),
                // },
                {
                    name: 'aggregationType',
                    label: i18n.t('Aggregation type'),
                },
            ],
        },
        {
            name: 'legends',
            label: i18n.t('Legends'),
            fields: [
                {
                    name: 'legendSets',
                    label: i18n.t('Legend sets'),
                },
            ],
        },
    ],
} as const satisfies SectionedFormDescriptor<TrackedEntityAttributeFormValues>
