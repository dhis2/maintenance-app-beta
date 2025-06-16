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
    'relativeScheduledDays'
> & {
    relativeScheduledDays: string
    sendEmail: boolean
    sendSms: boolean
    userGroupRecipient?: string
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
        beforeAfter: template.beforeAfter || '',
        sendStrategy: template.sendStrategy,
        deliveryChannels: template.deliveryChannels,
        dataSets: fetchedDataSets,
        recipientUserGroup: template.recipientUserGroup,
        userGroupRecipient: template.recipientUserGroup?.id,
        sendEmail: !!template.deliveryChannels?.includes('EMAIL'),
        sendSms: !!template.deliveryChannels?.includes('SMS'),
    }
}
