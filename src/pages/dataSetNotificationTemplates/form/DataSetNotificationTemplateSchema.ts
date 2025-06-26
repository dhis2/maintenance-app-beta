import { z } from 'zod'
import { modelFormSchemas } from '../../../lib'
import { DataSetNotificationTemplate } from '../../../types/generated'

const {
    identifiable,
    withAttributeValues,
    withDefaultListColumns,
    referenceCollection,
} = modelFormSchemas

export enum DeliveryChannel {
    SMS = 'SMS',
    EMAIL = 'EMAIL',
    HTTP = 'HTTP',
}

const DataSetNotificationTemplateBaseSchema = z.object({
    code: z.string().optional(),
    description: z.string().optional(),
    dataSetNotificationTrigger: z.nativeEnum(
        DataSetNotificationTemplate.dataSetNotificationTrigger
    ),
    notificationRecipient: z.nativeEnum(
        DataSetNotificationTemplate.notificationRecipient
    ),
    deliveryChannels: z.array(z.nativeEnum(DeliveryChannel)).default([]),
    messageTemplate: z.string(),
    subjectTemplate: z.string().optional(),
    relativeScheduledDays: z.union([z.string(), z.number()]).optional(),
    recipientUserGroup: z
        .object({
            id: z.string(),
            displayName: z.string().optional(),
        })
        .optional(),
    dataSets: referenceCollection.default([]),
    sendStrategy: z
        .nativeEnum(DataSetNotificationTemplate.sendStrategy)
        .optional(),
})

export const DataSetNotificationTemplateFormSchema =
    DataSetNotificationTemplateBaseSchema.merge(identifiable)
        .merge(withAttributeValues)
        .extend({
            code: z.string().optional(),
            description: z.string().optional(),
            name: z.string().default(''),
            dataSetNotificationTrigger: z.nativeEnum(
                DataSetNotificationTemplate.dataSetNotificationTrigger
            ),
            notificationRecipient: z.nativeEnum(
                DataSetNotificationTemplate.notificationRecipient
            ),
            deliveryChannels: z
                .array(z.nativeEnum(DeliveryChannel))
                .default([]),
            messageTemplate: z.string(),
            subjectTemplate: z.string().optional(),
            relativeScheduledDays: z.union([z.string(), z.number()]).optional(),
            recipientUserGroup: z
                .object({
                    id: z.string(),
                    displayName: z.string().optional(),
                })
                .optional(),
            dataSets: referenceCollection.default([]),
            sendStrategy: z
                .nativeEnum(DataSetNotificationTemplate.sendStrategy)
                .optional(),
        })

export const DataSetNotificationTemplateListSchema =
    DataSetNotificationTemplateBaseSchema.merge(withDefaultListColumns)
