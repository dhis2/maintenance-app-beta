import i18n from '@dhis2/d2-i18n'
import { z } from 'zod'
import { createFormValidate, getDefaults, modelFormSchemas } from '../../../lib'

const { identifiable, withAttributeValues } = modelFormSchemas

const relationshipTypeBaseSchema = z.object({
    name: z.string().trim().min(1, i18n.t('Name is required')),
    code: z.string().trim().optional(),
    description: z.string().trim().optional(),
    bidirectional: z.boolean().default(false),
    fromToName: z
        .string()
        .trim()
        .min(
            1,
            i18n.t('Relationship name seen from initiating entity is required')
        ),
    toFromName: z.string().trim().optional(),
})

export const relationshipTypeFormSchema = relationshipTypeBaseSchema
    .merge(identifiable)
    .merge(withAttributeValues)
    .superRefine((data, ctx) => {
        if (data.bidirectional && !data.toFromName?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: i18n.t(
                    'Relationship name seen from receiving entity is required when bidirectional is checked'
                ),
                path: ['toFromName'],
            })
        }
    })

export const initialRelationshipTypeValues = getDefaults(
    relationshipTypeFormSchema
)

export const validateRelationshipType = createFormValidate(
    relationshipTypeFormSchema
)
