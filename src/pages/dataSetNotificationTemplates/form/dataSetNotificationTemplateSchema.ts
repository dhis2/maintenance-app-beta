import { z } from 'zod'
import { createFormValidate, getDefaults, modelFormSchemas } from '../../../lib'
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

const dataSetNotificationTemplateBaseSchema = z.object({
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

export const dataSetNotificationTemplateFormSchema =
    dataSetNotificationTemplateBaseSchema
        .merge(identifiable)
        .merge(withAttributeValues)
        .extend({
            code: z.string().optional().default(''),
            description: z.string().optional().default(''),
            name: z.string().default(''),
            id: z.string().default(''),
            dataSetNotificationTrigger: z
                .nativeEnum(
                    DataSetNotificationTemplate.dataSetNotificationTrigger
                )
                .default(
                    DataSetNotificationTemplate.dataSetNotificationTrigger
                        .SCHEDULED_DAYS
                ),
            notificationRecipient: z
                .nativeEnum(DataSetNotificationTemplate.notificationRecipient)
                .default(
                    DataSetNotificationTemplate.notificationRecipient.USER_GROUP
                ),
            deliveryChannels: z
                .array(z.nativeEnum(DeliveryChannel))
                .default([]),
            messageTemplate: z.string(),
            subjectTemplate: z.string().optional(),
            relativeScheduledDays: z.coerce.number().default(0),
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

export const dataSetNotificationTemplateListSchema =
    dataSetNotificationTemplateBaseSchema.merge(withDefaultListColumns)

export const initialValues = getDefaults(dataSetNotificationTemplateFormSchema)

export const validate = createFormValidate(
    dataSetNotificationTemplateBaseSchema
)

export type DataSetNotificationFormValues = z.infer<
    typeof dataSetNotificationTemplateFormSchema
>
