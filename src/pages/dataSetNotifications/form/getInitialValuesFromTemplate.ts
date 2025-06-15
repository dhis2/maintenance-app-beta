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
    fetchedDataSets: DataSet[] | []
) => {
    return {
        name: template.name,
        code: template.code,
        subjectTemplate: template.subjectTemplate,
        messageTemplate: template.messageTemplate,
        notificationRecipient: template.notificationRecipient,
        dataSetNotificationTrigger: template.dataSetNotificationTrigger,
        relativeScheduledDays: template.relativeScheduledDays,
        beforeAfter: template.beforeAfter || '',
        sendStrategy: template.sendStrategy,
        userGroupRecipient: template.recipientUserGroup?.id,
        dataSets: fetchedDataSets,
        sendEmail: !!template.deliveryChannels?.includes('EMAIL'),
        sendSms: !!template.deliveryChannels?.includes('SMS'),
    }
}
