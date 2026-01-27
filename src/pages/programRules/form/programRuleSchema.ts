import { z } from 'zod'
import { modelFormSchemas } from '../../../lib'

const { modelReference, withDefaultListColumns } = modelFormSchemas

const programRuleBaseSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    priority: z.number().optional(),
    condition: z.string().optional(),
    program: modelReference.extend({ displayName: z.string() }).optional(),
    programStage: modelReference
        .extend({ displayName: z.string().optional() })
        .optional(),
})

export const programRuleListSchema = programRuleBaseSchema.merge(
    withDefaultListColumns
)
