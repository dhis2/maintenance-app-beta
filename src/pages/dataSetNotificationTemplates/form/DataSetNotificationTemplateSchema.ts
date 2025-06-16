import { z } from 'zod'
import { modelFormSchemas } from '../../../lib'

const {
    identifiable,
    withAttributeValues,
    referenceCollection,
    modelReference,
    withDefaultListColumns,
} = modelFormSchemas

export enum NotificationTrigger {
    COMPLETION = 'COMPLETION',
    SCHEDULED_DAYS = 'SCHEDULED_DAYS',
}

export enum NotificationRecipient {
    ORGANISATION_UNIT_CONTACT = 'ORGANISATION_UNIT_CONTACT',
    USER_GROUP = 'USER_GROUP',
    // Add more if needed
}

export enum DeliveryChannel {
    SMS = 'SMS',
    EMAIL = 'EMAIL',
    // Add more if needed
}

export enum NotificationSendStrategy {
    SINGLE_NOTIFICATION = 'SINGLE_NOTIFICATION',
    COLLECTIVE_SUMMARY = 'COLLECTIVE_SUMMARY',
}

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
        relativeScheduledDays: z.number().optional(),
        recipientUserGroup: modelReference.optional(),
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
