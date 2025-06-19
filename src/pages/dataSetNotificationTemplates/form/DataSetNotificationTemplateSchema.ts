import { z } from 'zod'
import { modelFormSchemas } from '../../../lib'

const { identifiable, withAttributeValues, withDefaultListColumns } =
    modelFormSchemas

export enum NotificationTrigger {
    COMPLETION = 'COMPLETION',
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
    NONE = 'NONE',
}

const referenceCollection = z.array(
    z.object({
        id: z.string(),
        name: z.string().optional(),
        displayName: z.string().optional(),
    })
)

export const DataSetNotificationTemplateSchema = identifiable
    .merge(withAttributeValues)
    .extend({
        code: z.string().optional(),
        description: z.string().optional(),
        notificationTrigger: z.nativeEnum(NotificationTrigger),
        notificationRecipient: z.nativeEnum(NotificationRecipient),
        deliveryChannels: z.array(z.nativeEnum(DeliveryChannel)).default([]),
        messageTemplate: z.string().optional(),
        subjectTemplate: z.string().optional(),
        relativeScheduledDays: z.string().optional(),
        recipientUserGroup: z.string().optional(),
        dataSets: referenceCollection.default([]),
        sendStrategy: z.nativeEnum(NotificationSendStrategy).optional(),
    })

export const dataSetNotificationTemplateListSchema =
    withDefaultListColumns.extend({
        notificationTrigger: z.nativeEnum(NotificationTrigger),
        notificationRecipient: z.nativeEnum(NotificationRecipient),
        sendStrategy: z.nativeEnum(NotificationSendStrategy).optional(),
        deliveryChannels: z.array(z.nativeEnum(DeliveryChannel)).default([]),
    })
