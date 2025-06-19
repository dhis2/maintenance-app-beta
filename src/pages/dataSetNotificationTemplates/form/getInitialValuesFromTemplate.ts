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
    beforeAfter: string
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
    beforeAfter: string
}

export const getInitialValuesFromTemplate = (
    template: DataSetNotificationTemplate,
    fetchedDataSets: DataSet[]
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
        dataSets: fetchedDataSets,
        recipientUserGroup: template?.recipientUserGroup?.id,
        beforeAfter: template.beforeAfter,
        sendEmail: template.deliveryChannels.includes('EMAIL'),
        sendSms: template.deliveryChannels.includes('SMS'),
    }
}

export const transformFormValues = (
    values: DataSetNotificationFormValues
): DataSetNotificationTemplate => {
    return {
        ...values,
        relativeScheduledDays: parseInt(values.relativeScheduledDays, 10),
        deliveryChannels: [
            ...(values.sendEmail ? ['EMAIL'] : []),
            ...(values.sendSms ? ['SMS'] : []),
        ],
        recipientUserGroup:
            values.recipientUserGroup && values.recipientUserGroup !== ''
                ? { id: values.recipientUserGroup }
                : undefined,
        dataSets: (values.dataSets || []).map((ds) => ({ id: ds.id })),
    }
}
