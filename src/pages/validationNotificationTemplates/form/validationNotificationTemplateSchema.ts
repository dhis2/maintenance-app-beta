import i18n from '@dhis2/d2-i18n'
import { z } from 'zod'
import { getDefaults, createFormValidate, modelFormSchemas } from '../../../lib'
import { ValidationNotificationTemplate } from '../../../types/generated'

/*  Note that this describes what we send to the server, 
    and not what is stored in the form. */
const {
    identifiable,
    referenceCollection,
    withAttributeValues,
    withDefaultListColumns,
} = modelFormSchemas

const validationNotificationTemplateBaseSchema = z.object({
    code: z.string().trim().optional(),
    notifyUsersInHierarchyOnly: z.boolean().optional(),
    sendStrategy: z
        .nativeEnum(ValidationNotificationTemplate.sendStrategy)
        .optional(),
})

export const validationNotificationTemplateFormSchema = identifiable
    .merge(withAttributeValues)
    .merge(validationNotificationTemplateBaseSchema)
    .extend({
        recipientUserGroups: referenceCollection.default([]),
        subjectTemplate: z
            .string()
            .max(100, {
                message: i18n.t(
                    'Please enter a maximum of {{upperBound}} characters',
                    { upperBound: '100' }
                ),
            })
            .optional(),
        messageTemplate: z
            .string()
            .max(1000, {
                message: i18n.t(
                    'Please enter a maximum of {{upperBound}} characters',
                    { upperBound: '1000' }
                ),
            })
            .optional(),
        validationRules: referenceCollection.default([]),
    })

export const validationNotificationTemplateListSchema =
    validationNotificationTemplateBaseSchema
        .merge(withDefaultListColumns)
        .extend({
            displayShortName: z.string(),
        })

export const initialValues = getDefaults(
    validationNotificationTemplateFormSchema
)

export const validate = createFormValidate(
    validationNotificationTemplateFormSchema
)
