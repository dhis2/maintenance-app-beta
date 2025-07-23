import { z } from 'zod'
import { createFormValidate, getDefaults, modelFormSchemas } from '../../../lib'
import { DataSetNotificationTemplate } from '../../../types/generated'

const { identifiable, withDefaultListColumns, referenceCollection } =
    modelFormSchemas

const dataSetNotificationTemplateBaseSchema = z.object({
    code: z.string().optional(),
    description: z.string().optional(),
    dataSetNotificationTrigger: z.nativeEnum(
        DataSetNotificationTemplate.dataSetNotificationTrigger
    ),
    notificationRecipient: z.nativeEnum(
        DataSetNotificationTemplate.notificationRecipient
    ),
    deliveryChannels: z.array(z.enum(['SMS', 'EMAIL', 'HTTP'])).default([]),
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
    dataSetNotificationTemplateBaseSchema.merge(identifiable).extend({
        code: z.string().optional(),
        description: z.string().optional(),
        dataSetNotificationTrigger: z
            .nativeEnum(DataSetNotificationTemplate.dataSetNotificationTrigger)
            .default(
                DataSetNotificationTemplate.dataSetNotificationTrigger
                    .SCHEDULED_DAYS
            ),
        notificationRecipient: z
            .nativeEnum(DataSetNotificationTemplate.notificationRecipient)
            .default(
                DataSetNotificationTemplate.notificationRecipient.USER_GROUP
            ),
        deliveryChannels: z.array(z.enum(['SMS', 'EMAIL', 'HTTP'])).default([]),
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

export const DataSetNotificationTemplateListSchema =
    dataSetNotificationTemplateBaseSchema.merge(withDefaultListColumns)

export const initialValues = getDefaults(dataSetNotificationTemplateFormSchema)

export type DataSetNotificationFormValues = z.infer<
    typeof dataSetNotificationTemplateFormSchema
>

export const validate = createFormValidate(
    dataSetNotificationTemplateBaseSchema
)

/**
 * Converts form values back to API payload
 */
export const transformFormValues = <
    TValues extends Partial<DataSetNotificationFormValues>
>(
    values: TValues
) => {
    const {
        recipientUserGroup,
        relativeScheduledDays,
        dataSets = [],
        ...rest
    } = values

    return {
        ...rest,
        relativeScheduledDays: Number(relativeScheduledDays),
        recipientUserGroup:
            rest.notificationRecipient === 'USER_GROUP' && recipientUserGroup
                ? { id: recipientUserGroup.id }
                : undefined,
        dataSets: dataSets.map(({ id }) => ({ id })),
    }
}
