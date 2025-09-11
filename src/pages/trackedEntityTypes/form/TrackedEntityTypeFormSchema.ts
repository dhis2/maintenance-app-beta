import { z } from 'zod'
import { modelFormSchemas } from '../../../lib'

const { withDefaultListColumns, withAttributeValues } = modelFormSchemas

const trackedEntityTypeBaseSchema = z.object({
    name: z.string().trim(),
    shortName: z.string().trim(),
    code: z.string().trim().optional(),
    description: z.string().trim().optional(),
    formName: z.string().trim().optional(),
    style: z
        .object({
            color: z.string().optional(),
            icon: z.string().optional(),
        })
        .default({}),
    allowAuditLog: z.boolean().optional(),
    minAttributesRequiredToSearch: z.number().optional(),
    maxTeiCountToReturn: z.number().optional(),
    featureType: z.string().trim().optional(),
    attributeValues: z
        .array(
            z.object({
                value: z.string(),
                attribute: z.object({
                    id: z.string(),
                }),
            })
        )
        .default([]),
})

export const trackedEntityTypeListSchema = trackedEntityTypeBaseSchema
    .merge(withDefaultListColumns)
    .merge(withAttributeValues)
    .extend({
        displayShortName: z.string(),
    })
