import i18n from '@dhis2/d2-i18n'
import { DataSet, UserGroup } from '../../../types/generated'
import { DataSetNotificationFormValues } from './DataSetNotificationTemplateSchema'

/**
 * Converts form values back to API payload
 */
export const transformFormValues = (values: DataSetNotificationFormValues) => {
    const {
        recipientUserGroup,
        relativeScheduledDays,
        dataSets = [],
        ...rest
    } = values

    return {
        ...rest,
        relativeScheduledDays: Number(relativeScheduledDays),
        recipientUserGroup:
            rest.notificationRecipient === 'USER_GROUP' && recipientUserGroup
                ? ({ id: recipientUserGroup.id } as UserGroup)
                : undefined,
        dataSets: dataSets.map(({ id }) => ({ id } as DataSet)),
    }
}

/**
 * Section data
 */
export const formDescriptor = {
    name: 'editDataSetNotificationForm',
    label: i18n.t('Edit Data Set Notification'),
    sections: [
        {
            name: 'basicInformation',
            label: i18n.t('Basic information'),
            fields: [
                { name: 'name', label: i18n.t('Name') },
                { name: 'code', label: i18n.t('Code') },
                { name: 'description', label: i18n.t('Description') },
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
}
