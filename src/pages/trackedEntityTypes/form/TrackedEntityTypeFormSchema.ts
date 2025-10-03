import { z } from 'zod'
import { createFormValidate, getDefaults, modelFormSchemas } from '../../../lib'

const { identifiable, withDefaultListColumns, withAttributeValues } =
    modelFormSchemas

const trackedEntityTypeBaseSchema = z.object({
    name: z.string().trim(),
    shortName: z
        .string()
        .trim()
        .max(50, 'Please enter a maximum of 50 characters'),
    code: z.string().trim().optional(),
    description: z.string().trim().optional(),
    formName: z.string().trim().optional(),
    style: z
        .object({
            color: z.string().optional(),
            icon: z.string().optional(),
        })
        .default({}),
    allowAuditLog: z.boolean().default(false),
    minAttributesRequiredToSearch: z
        .number()
        .min(
            0,
            'Minimum number of attributes required to search must be 0 or greater'
        )
        .default(1),
    maxTeiCountToReturn: z
        .number()
        .min(
            0,
            'Maximum number of tracked entity instances to return must be 0 or greater'
        )
        .default(0),
    featureType: z.string().trim().optional(),
    trackedEntityTypeAttributes: z
        .array(
            z.object({
                mandatory: z.boolean().default(false),
                searchable: z.boolean().default(false),
                displayInList: z.boolean().default(false),
                trackedEntityAttribute: z.object({
                    id: z.string(),
                    displayName: z.string(),
                }),
            })
        )
        .default([]),
})

export const trackedEntityTypeFormSchema = trackedEntityTypeBaseSchema
    .merge(identifiable)
    .merge(withAttributeValues)

export const trackedEntityTypeListSchema = trackedEntityTypeBaseSchema
    .merge(withDefaultListColumns)
    .merge(withAttributeValues)
    .extend({
        name: z.string(),
        displayShortName: z.string(),
    })

export const initialTrackedEntityTypeValues = getDefaults(
    trackedEntityTypeFormSchema
)
export const validateTrackedEntityType = createFormValidate(
    trackedEntityTypeFormSchema
)
