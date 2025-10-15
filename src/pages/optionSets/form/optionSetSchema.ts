import { z } from 'zod'
import { modelFormSchemas } from '../../../lib'

const { identifiable, withDefaultListColumns, withAttributeValues } =
    modelFormSchemas

export const optionSetBaseSchema = z.object({
    name: z.string().trim(),
    displayName: z.string().trim(),
    valueType: z.string(),
    code: z.string().trim().optional(),
    options: z
        .array(
            z.object({
                id: z.string(),
                code: z.string().optional(),
                displayName: z.string(),
                sortOrder: z.number().optional(),
            })
        )
        .optional(),
})

export const optionSetListSchema = identifiable
    .merge(optionSetBaseSchema)
    .merge(withAttributeValues)
    .merge(withDefaultListColumns)

export const optionSetSchema = identifiable.merge(optionSetBaseSchema)
