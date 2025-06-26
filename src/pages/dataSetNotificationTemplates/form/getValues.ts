import i18n from '@dhis2/d2-i18n'
import {
    DeliveryChannel,
    NotificationRecipient,
    NotificationSendStrategy,
    NotificationTrigger,
} from './DataSetNotificationTemplateSchema'

export interface DataSet {
    id?: string
    name?: string
    displayName?: string
}

export interface DataSetNotificationTemplate {
    id?: string
    code?: string
    name: string
    displayName?: string
    description?: string
    subjectTemplate?: string
    messageTemplate?: string
    notificationRecipient: NotificationRecipient
    dataSetNotificationTrigger: NotificationTrigger
    relativeScheduledDays?: number | string
    sendStrategy?: NotificationSendStrategy
    deliveryChannels: DeliveryChannel[]
    recipientUserGroup?: {
        id?: string
        displayName?: string
    }
    dataSets: DataSet[]
}

export type DataSetNotificationFormValues = Omit<
    DataSetNotificationTemplate,
    'relativeScheduledDays' | 'recipientUserGroup'
> & {
    relativeScheduledDays?: number | string
    beforeAfter?: 'BEFORE' | 'AFTER'
    recipientUserGroup?: {
        id: string
        displayName?: string
    }
}

/**
 * Converts API template to form-friendly values
 */
export const getInitialValuesFromTemplate = (
    template: DataSetNotificationTemplate
): DataSetNotificationFormValues => {
    const { relativeScheduledDays = 0, recipientUserGroup, ...rest } = template

    return {
        ...rest,
        relativeScheduledDays: Math.abs(Number(relativeScheduledDays)),
        beforeAfter: Number(relativeScheduledDays) < 0 ? 'BEFORE' : 'AFTER',
        recipientUserGroup: recipientUserGroup?.id
            ? {
                  id: recipientUserGroup.id,
                  displayName: recipientUserGroup.displayName,
              }
            : undefined,
    }
}

/**
 * Converts form values back to API payload
 */
export const transformFormValues = (
    values: DataSetNotificationFormValues
): DataSetNotificationTemplate => {
    const {
        relativeScheduledDays = 0,
        beforeAfter,
        recipientUserGroup,
        dataSets = [],
        ...rest
    } = values

    const signedDays =
        beforeAfter === 'BEFORE'
            ? -Math.abs(Number(relativeScheduledDays))
            : Math.abs(Number(relativeScheduledDays))

    return {
        ...rest,
        relativeScheduledDays: signedDays,
        recipientUserGroup: recipientUserGroup?.id
            ? { id: recipientUserGroup.id }
            : undefined,
        dataSets: dataSets.map(({ id }) => ({ id })),
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
