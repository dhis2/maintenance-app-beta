import i18n from '@dhis2/d2-i18n'
import { SectionedFormDescriptor } from '../../../../lib'
import { ProgramNotificationFormValues } from './programNotificationTemplateSchema'

/**
 * Section data
 */
export const programNotificationFormDescriptor = {
    name: 'editProgramNotificationForm',
    label: i18n.t('Edit Program Notification'),
    sections: [
        {
            name: 'basicInformation',
            label: i18n.t('Basic information'),
            fields: [
                { name: 'name', label: i18n.t('Name') },
                { name: 'code', label: i18n.t('Code') },
            ],
        },
        {
            name: 'messageContent',
            label: i18n.t('Message content'),
            fields: [
                { name: 'subjectTemplate', label: i18n.t('Subject template') },
                { name: 'messageTemplate', label: i18n.t('Message template') },
            ],
        },
        {
            name: 'notificationTiming',
            label: i18n.t('Notification timing'),
            fields: [
                {
                    name: 'notificationTrigger',
                    label: i18n.t('Trigger'),
                },
                {
                    name: 'relativeScheduledDays',
                    label: i18n.t('Scheduled days'),
                },
            ],
        },
        {
            name: 'recipient',
            label: i18n.t('Recipient'),
            fields: [
                {
                    name: 'deliveryChannels',
                    label: i18n.t('Delivery channels'),
                },
                {
                    name: 'notificationRecipient',
                    label: i18n.t('Notification recipient'),
                },
                {
                    name: 'recipientUserGroup',
                    label: i18n.t('Recipient user group'),
                },
                {
                    name: 'recipientUserGroup',
                    label: i18n.t('Recipient user group'),
                },
                {
                    name: 'notifyUsersInHierarchyOnly',
                    label: i18n.t('Notify users in hierarchy only'),
                },
                {
                    name: 'notifyParentOrganisationUnitOnly',
                    label: i18n.t('Notify parent organisation unit only'),
                },
                {
                    name: 'recipientProgramAttribute',
                    label: i18n.t('Recipient program attribute'),
                },
            ],
        },
    ],
} satisfies SectionedFormDescriptor<ProgramNotificationFormValues>
