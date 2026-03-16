import i18n from '@dhis2/d2-i18n'
import { z } from 'zod'
import {
    createFormValidate,
    getDefaultsOld,
    modelFormSchemas,
} from '../../../../lib'
import { ProgramNotificationTemplate } from '../../../../types/generated'

const { identifiable } = modelFormSchemas

const programNotificationTemplateBaseSchema = z.object({
    code: z.string().optional(),
    notificationTrigger: z.nativeEnum(
        ProgramNotificationTemplate.notificationTrigger
    ),
    notificationRecipient: z.nativeEnum(
        ProgramNotificationTemplate.notificationRecipient
    ),
    deliveryChannels: z.array(z.enum(['SMS', 'EMAIL', 'HTTP'])).default([]),
    messageTemplate: z.string().max(10000, {
        message: i18n.t('Please enter a maximum of {{upperBound}} characters', {
            upperBound: '100',
        }),
    }),
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
        .optional(),
    sendRepeatable: z.boolean().optional(),
    recipientProgramAttribute: z
        .object({
            id: z.string().optional(),
            displayName: z.string().optional(),
        })
        .optional(),
    recipientDataElement: z
        .object({
            id: z.string().optional(),
            displayName: z.string().optional(),
        })
        .optional(),
    notifyUsersInHierarchyOnly: z.boolean().optional(),
    notifyParentOrganisationUnitOnly: z.boolean().optional(),
})

export const programNotificationTemplateFormSchema =
    programNotificationTemplateBaseSchema.merge(identifiable).extend({
        notificationTrigger: z
            .nativeEnum(ProgramNotificationTemplate.notificationTrigger)
            .default(
                ProgramNotificationTemplate.notificationTrigger.COMPLETION
            ),
        notificationRecipient: z
            .nativeEnum(ProgramNotificationTemplate.notificationRecipient)
            .default(
                ProgramNotificationTemplate.notificationRecipient
                    .USERS_AT_ORGANISATION_UNIT
            ),
    })

export const initialValues = getDefaultsOld(
    programNotificationTemplateFormSchema
)

export type ProgramNotificationFormValues = z.infer<
    typeof programNotificationTemplateFormSchema
>

export const validate = createFormValidate(
    programNotificationTemplateBaseSchema
)
