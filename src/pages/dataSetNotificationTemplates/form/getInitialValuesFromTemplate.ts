export interface DataSet {
    id: string
    name: string
    displayName: string
}

export interface DataSetNotificationTemplate {
    id: string
    code: string
    name: string
    displayName: string
    subjectTemplate: string
    messageTemplate: string
    notificationRecipient: string
    dataSetNotificationTrigger: string
    relativeScheduledDays: number
    sendStrategy: string
    deliveryChannels: string[]
    recipientUserGroup?: { id: string }
    dataSets: Array<{ id: string }>
}

export type DataSetNotificationFormValues = Omit<
    DataSetNotificationTemplate,
    'relativeScheduledDays' | 'recipientUserGroup'
> & {
    relativeScheduledDays: string
    sendEmail: boolean
    sendSms: boolean
    recipientUserGroup?: string
}

export const getInitialValuesFromTemplate = (
    template: DataSetNotificationTemplate
): DataSetNotificationFormValues => {
    return {
        id: template.id,
        code: template.code,
        name: template.name,
        displayName: template.displayName,
        subjectTemplate: template.subjectTemplate,
        messageTemplate: template.messageTemplate,
        notificationRecipient: template.notificationRecipient,
        dataSetNotificationTrigger: template.dataSetNotificationTrigger,
        relativeScheduledDays: String(template.relativeScheduledDays),
        sendStrategy: template.sendStrategy,
        deliveryChannels: template.deliveryChannels,
        dataSets: template.dataSets,
        recipientUserGroup: template?.recipientUserGroup?.id,
        sendEmail: template.deliveryChannels.includes('EMAIL'),
        sendSms: template.deliveryChannels.includes('SMS'),
    }
}

export const transformFormValues = (
    values: DataSetNotificationFormValues
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
        sendStrategy,
        dataSets,
        sendEmail,
        sendSms,
        recipientUserGroup,
    } = values

    const deliveryChannels = [
        ...(sendEmail ? ['EMAIL'] : []),
        ...(sendSms ? ['SMS'] : []),
    ]

    const payload: DataSetNotificationTemplate = {
        id,
        code,
        name,
        displayName,
        subjectTemplate,
        messageTemplate,
        notificationRecipient,
        dataSetNotificationTrigger,
        relativeScheduledDays: parseInt(relativeScheduledDays, 10),
        sendStrategy,
        deliveryChannels,
        recipientUserGroup:
            recipientUserGroup && recipientUserGroup !== ''
                ? { id: recipientUserGroup }
                : undefined,
        dataSets: (dataSets || []).map((ds) => ({ id: ds.id })),
    }

    return payload
}
