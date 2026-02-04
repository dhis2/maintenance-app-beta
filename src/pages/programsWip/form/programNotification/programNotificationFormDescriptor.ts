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
            fields: [{ name: 'name', label: i18n.t('Name') }],
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
                    name: 'dataSetNotificationTrigger',
                    label: i18n.t('Trigger'),
                },
                {
                    name: 'relativeScheduledDays',
                    label: i18n.t('Scheduled days'),
                },
                {
                    name: 'sendStrategy',
                    label: i18n.t('Send strategy'),
                },
            ],
        },
        {
            name: 'recipient',
            label: i18n.t('Recipient'),
            fields: [
                {
                    name: 'notificationRecipient',
                    label: i18n.t('Notification recipient'),
                },
                {
                    name: 'recipientUserGroup',
                    label: i18n.t('Recipient user group'),
                },
                {
                    name: 'deliveryChannels',
                    label: i18n.t('Delivery channels'),
                },
            ],
        },
    ],
} satisfies SectionedFormDescriptor<ProgramNotificationFormValues>
