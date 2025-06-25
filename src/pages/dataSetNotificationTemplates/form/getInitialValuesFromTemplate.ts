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
    name:  string
    displayName?: string
    description?: string
    subjectTemplate?: string
    messageTemplate?: string
    notificationRecipient: NotificationRecipient
    dataSetNotificationTrigger: NotificationTrigger
    relativeScheduledDays?: number
    sendStrategy?: NotificationSendStrategy
    deliveryChannels: DeliveryChannel[]
    recipientUserGroup?: { id?: string }
    dataSets: DataSet[]
}

export type DataSetNotificationFormValues = Omit<
    DataSetNotificationTemplate,
    'relativeScheduledDays' | 'recipientUserGroup'
> & {
    relativeScheduledDays?: string
    sendEmail: boolean
    sendSms: boolean
    recipientUserGroup?: { id: string; displayName?: string }
    beforeAfter?: 'BEFORE' | 'AFTER'
}

export const getInitialValuesFromTemplate = (
    template: DataSetNotificationTemplate
): DataSetNotificationFormValues => {
    let recipientUserGroup: { id: string } | undefined

    if (typeof template.recipientUserGroup === 'string') {
        recipientUserGroup = { id: template.recipientUserGroup }
    } else if (
        typeof template.recipientUserGroup === 'object' &&
        template.recipientUserGroup?.id
    ) {
        recipientUserGroup = { id: template.recipientUserGroup.id }
    }

    return {
        id: template.id ,
        code: template.code,
        name: template.name,
        displayName: template.displayName,
        subjectTemplate: template.subjectTemplate,
        messageTemplate: template.messageTemplate,
        notificationRecipient: template.notificationRecipient,
        dataSetNotificationTrigger: template.dataSetNotificationTrigger,
        relativeScheduledDays:
            template.relativeScheduledDays !== undefined
                ? String(template.relativeScheduledDays)
                : undefined,
        beforeAfter:
            template.relativeScheduledDays !== undefined &&
            template.relativeScheduledDays < 0
                ? 'BEFORE'
                : 'AFTER',
        sendStrategy: template.sendStrategy,
        deliveryChannels: template.deliveryChannels,
        dataSets: template.dataSets,
        sendEmail: template.deliveryChannels.includes(DeliveryChannel.EMAIL),
        sendSms: template.deliveryChannels.includes(DeliveryChannel.SMS),
        recipientUserGroup,
    }
}

export const transformFormValues = (
    values: DataSetNotificationFormValues & { beforeAfter?: 'BEFORE' | 'AFTER' }
): DataSetNotificationTemplate => {
    const {
        id,
        code,
        name,
        displayName,
        subjectTemplate,
        messageTemplate,
        notificationRecipient,
        dataSetNotificationTrigger,
        relativeScheduledDays,
        beforeAfter,
        sendStrategy,
        dataSets,
        sendEmail,
        sendSms,
        recipientUserGroup,
    } = values

    const deliveryChannels: DeliveryChannel[] = [
        ...(sendEmail ? [DeliveryChannel.EMAIL] : []),
        ...(sendSms ? [DeliveryChannel.SMS] : []),
    ]

    const absDays = Math.abs(parseInt(relativeScheduledDays ?? '', 10) || 0)
    const signedDays = beforeAfter === 'BEFORE' ? -absDays : absDays

    const payload: DataSetNotificationTemplate = {
        id,
        code,
        name,
        displayName,
        subjectTemplate,
        messageTemplate,
        notificationRecipient,
        dataSetNotificationTrigger,
        relativeScheduledDays: signedDays,
        sendStrategy,
        deliveryChannels,
        recipientUserGroup:
            recipientUserGroup &&
            recipientUserGroup.id &&
            recipientUserGroup.id !== ''
                ? { id: recipientUserGroup.id }
                : undefined,
        dataSets: (dataSets || []).map((ds) => ({ id: ds.id })),
    }

    return payload
}
