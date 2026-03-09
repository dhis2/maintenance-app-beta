import i18n from '@dhis2/d2-i18n'
import { SectionedFormDescriptor } from '../../../../lib'
import { ProgramValues } from '../../EditTrackerProgram'

export const EventProgramFormDescriptor = {
    name: 'Program',
    label: 'Program',
    sections: [
        {
            name: 'programDetails',
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
                {
                    name: 'expiryDays',
                    label: i18n.t(
                        'Close data entry a number of days after the end of a period'
                    ),
                },
                {
                    name: 'completeEventsExpiryDays',
                    label: i18n.t(
                        'Lock completed events after a number of days'
                    ),
                },
                {
                    name: 'openDaysAfterCoEndDate',
                    label: i18n.t(
                        'Close data entry a number of days after "Implementing partner" end date'
                    ),
                },
                {
                    name: 'minAttributesRequiredToSearch',
                    label: i18n.t(
                        'Minimum number of attributes required to search'
                    ),
                },
                {
                    name: 'maxTeiCountToReturn',
                    label: i18n.t(
                        'Maximum number of search results to display'
                    ),
                },
            ],
        },
        // {
        //     name: 'programCustomization',
        //     label: i18n.t('Program Customization'),
        //     fields: [
        //         {
        //             name: 'style',
        //             label: i18n.t('Visual configuration'),
        //         },
        //         {
        //             name: 'incidentDateLabel',
        //             label: i18n.t('Custom label for "Incident date"'),
        //         },
        //         {
        //             name: 'enrollmentDateLabel',
        //             label: i18n.t('Custom label for "Enrollment date"'),
        //         },
        //         {
        //             name: 'enrollmentLabel',
        //             label: i18n.t('Custom label for "Enrollment"'),
        //         },
        //         {
        //             name: 'eventLabel',
        //             label: i18n.t('Custom label for "Event"'),
        //         },
        //         {
        //             name: 'programStageLabel',
        //             label: i18n.t('Custom label for "Program stage"'),
        //         },
        //         {
        //             name: 'followUpLabel',
        //             label: i18n.t('Custom label for "Follow-up"'),
        //         },
        //         {
        //             name: 'orgUnitLabel',
        //             label: i18n.t('Custom label for "Registering unit"'),
        //         },
        //         {
        //             name: 'relationshipLabel',
        //             label: i18n.t('Custom label for "Relationship"'),
        //         },
        //         { name: 'noteLabel', label: i18n.t('Custom label for "Note"') },
        //         {
        //             name: 'displayFrontPageList',
        //             label: i18n.t(
        //                 'Display enrolled TEs in the front page list'
        //             ),
        //         },
        //     ],
        // },
        {
            name: 'programSettings',
            label: i18n.t('Settings'),
            fields: [
                {
                    name: 'programStages[0].enableUserAssignment',
                    label: i18n.t('Allow user assignment of events'),
                },
                {
                    name: 'programStages[0].blockEntryForm',
                    label: i18n.t('Block entry form after completed'),
                },
                {
                    name: 'programStages[0].preGenerateUID',
                    label: i18n.t('Pre-generate event UID'),
                },
                {
                    name: 'programStages[0].validationStrategy',
                    label: i18n.t('Validation strategy'),
                },
            ],
        },
        {
            name: 'data',
            label: i18n.t('Data', { nsSeparator: '~:~' }),
            fields: [
                {
                    name: 'programStages[0].programStageDataElements',
                    label: i18n.t('Data elements'),
                },
            ],
        },
        {
            name: 'form',
            label: i18n.t('Form', { nsSeparator: '~:~' }),
            fields: [
                {
                    name: 'programStages[0].dataEntryForm',
                    label: i18n.t('Custom form'),
                },
                {
                    name: 'programStages[0].programStageSections',
                    label: i18n.t('Sections'),
                },
            ],
        },
        // {
        //     name: 'programNotifications',
        //     label: i18n.t('Notifications'),
        //     fields: [],
        // },
        // {
        //     name: 'accessAndSharing',
        //     label: i18n.t('Access and Sharing'),
        //     fields: [
        //         {
        //             name: 'organisationUnits',
        //             label: i18n.t('Organisation units'),
        //         },
        //         {
        //             name: 'sharing',
        //             label: i18n.t('Role access'),
        //         },
        //     ],
        // },
    ],
} as const satisfies SectionedFormDescriptor<ProgramValues>
