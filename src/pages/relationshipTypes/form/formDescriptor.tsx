import i18n from '@dhis2/d2-i18n'
import { SectionedFormDescriptor } from '../../../lib'
import { relationshipTypeFormSchema } from './relationshipTypeSchema'

type RelationshipTypeValues = typeof relationshipTypeFormSchema._type

export const RelationshipTypeFormDescriptor = {
    name: 'RelationshipType',
    label: 'Relationship Type',
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
                    name: 'code',
                    label: i18n.t('Code'),
                },
                {
                    name: 'description',
                    label: i18n.t('Description'),
                },
                {
                    name: 'bidirectional',
                    label: i18n.t('Bidirectional'),
                },
                {
                    name: 'fromToName',
                    label: i18n.t(
                        'Relationship name seen from initiating entity'
                    ),
                },
                {
                    name: 'toFromName',
                    label: i18n.t(
                        'Relationship name seen from receiving entity'
                    ),
                },
            ],
        },
        {
            name: 'relationshipSides',
            label: i18n.t('Relationship sides'),
            fields: [],
        },
    ],
} as const satisfies SectionedFormDescriptor<RelationshipTypeValues>
