import { z } from 'zod'
import { getDefaults, createFormValidate, modelFormSchemas } from '../../../lib'

const { identifiable, withDefaultListColumns } = modelFormSchemas

export enum NotificationTrigger {
    COMPLETION = 'DATA_SET_COMPLETION',
    SCHEDULED_DAYS = 'SCHEDULED_DAYS',
}

export enum NotificationRecipient {
    ORGANISATION_UNIT_CONTACT = 'ORGANISATION_UNIT_CONTACT',
    USER_GROUP = 'USER_GROUP',
}

export enum DeliveryChannel {
    SMS = 'SMS',
    EMAIL = 'EMAIL',
}

export enum NotificationSendStrategy {
    SINGLE_NOTIFICATION = 'SINGLE_NOTIFICATION',
    COLLECTIVE_SUMMARY = 'COLLECTIVE_SUMMARY',
}

const referenceCollection = z.array(
    z.object({
        id: z.string().optional(),
        name: z.string().optional(),
        displayName: z.string().optional(),
    })
)

export const DataSetNotificationTemplateSchema = identifiable.extend({
    code: z.string().optional(),
    description: z.string().optional(),
    name: z.string().default(''),
    dataSetNotificationTrigger: z
        .nativeEnum(NotificationTrigger)
        .default(NotificationTrigger.COMPLETION),
    notificationRecipient: z
        .nativeEnum(NotificationRecipient)
        .default(NotificationRecipient.ORGANISATION_UNIT_CONTACT),
    deliveryChannels: z.array(z.nativeEnum(DeliveryChannel)).default([]),
    messageTemplate: z.string().optional(),
    subjectTemplate: z.string().optional(),
    relativeScheduledDays: z.string().optional(),
    recipientUserGroup: z
        .object({
            id: z.string(),
            displayName: z.string().optional(),
        })
        .optional(),
    dataSets: referenceCollection.default([]),
    sendStrategy: z.nativeEnum(NotificationSendStrategy).optional(),
})

export const dataSetNotificationTemplateListSchema =
    withDefaultListColumns.extend({
        name: z.string(),
    })

export const initialValues = getDefaults(DataSetNotificationTemplateSchema)

export const validate = createFormValidate(DataSetNotificationTemplateSchema)
