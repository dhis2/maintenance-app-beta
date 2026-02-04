import i18n from '@dhis2/d2-i18n'
import { z } from 'zod'
import {
    createFormValidate,
    getDefaults,
    modelFormSchemas,
} from '../../../../lib'
import { ProgramNotificationTemplate } from '../../../../types/generated'

const { identifiable, withDefaultListColumns, referenceCollection } =
    modelFormSchemas

const programNotificationTemplateBaseSchema = z.object({
    programNotificationTrigger: z
        .nativeEnum(ProgramNotificationTemplate.notificationTrigger)
        .optional(),
    notificationRecipient: z
        .nativeEnum(ProgramNotificationTemplate.notificationRecipient)
        .optional(),
    deliveryChannels: z.array(z.enum(['SMS', 'EMAIL', 'HTTP'])).default([]),
    messageTemplate: z.string(),
    subjectTemplate: z
        .string()
        .max(100, {
            message: i18n.t(
                'Please enter a maximum of {{upperBound}} characters',
                { upperBound: '100' }
            ),
        })
        .optional(),
    relativeScheduledDays: z.number().int().optional(),
    recipientUserGroup: z
        .object({
            id: z.string().optional(),
            displayName: z.string().optional(),
        })
        .optional()
        .default({}),
    programs: referenceCollection.default([]),
    notifyUsersInHierarchyOnly: z.boolean().optional(),
})

export const programNotificationTemplateFormSchema =
    programNotificationTemplateBaseSchema.merge(identifiable).extend({
        programNotificationTrigger: z
            .nativeEnum(ProgramNotificationTemplate.notificationTrigger)
            .default(
                ProgramNotificationTemplate.notificationTrigger
                    .SCHEDULED_DAYS_DUE_DATE
            ),
        notificationRecipient: z
            .nativeEnum(ProgramNotificationTemplate.notificationRecipient)
            .default(
                ProgramNotificationTemplate.notificationRecipient.USER_GROUP
            ),
    })

export const programNotificationTemplateListSchema =
    programNotificationTemplateBaseSchema.merge(withDefaultListColumns)

export const initialValues = getDefaults(programNotificationTemplateFormSchema)

export type ProgramNotificationFormValues = z.infer<
    typeof programNotificationTemplateFormSchema
>

export const validate = createFormValidate(
    programNotificationTemplateBaseSchema
)

/**
 * Converts form values back to API payload
 */
export const transformFormValues = <
    TValues extends Partial<ProgramNotificationFormValues>
>(
    values: TValues
) => {
    const {
        recipientUserGroup,
        relativeScheduledDays,
        notifyUsersInHierarchyOnly,
        programs = [],
        ...rest
    } = values

    return {
        ...rest,
        relativeScheduledDays:
            rest.programNotificationTrigger === 'SCHEDULED_DAYS_DUE_DATE' &&
            relativeScheduledDays
                ? Number(relativeScheduledDays)
                : undefined,
        recipientUserGroup:
            rest.notificationRecipient === 'USER_GROUP' &&
            recipientUserGroup?.id
                ? { id: recipientUserGroup.id }
                : undefined,
        notifyUsersInHierarchyOnly:
            rest.notificationRecipient === 'USER_GROUP' && recipientUserGroup
                ? Boolean(notifyUsersInHierarchyOnly)
                : undefined,
        programs: programs.map(({ id }) => ({ id })),
    }
}
