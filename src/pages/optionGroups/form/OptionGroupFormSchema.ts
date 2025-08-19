import { z } from 'zod'
import { modelFormSchemas } from '../../../lib'

const { withDefaultListColumns } = modelFormSchemas

const optionGroupBaseSchema = z.object({
    code: z.string().trim().optional(),
    shortName: z.string().trim(),
    name: z.string().trim(),
    description: z.string().trim().optional(),
    legendSets: z.array(z.object({ id: z.string() })),
    options: z.array(
        z.object({
            name: z.string(),
            displayName: z.string(),
            id: z.string(),
        })
    ),
    optionSet: z
        .object({
            id: z.string(),
        })
        .optional(),
})

export const OptionGroupListSchema = optionGroupBaseSchema
    .merge(withDefaultListColumns)
    .extend({
        displayShortName: z.string(),
    })
