import { z } from 'zod'
import { modelFormSchemas } from '../../../lib'

const { withDefaultListColumns } = modelFormSchemas

const validationRuleGroupsBaseSchema = z.object({
    code: z.string().trim().optional(),
    name: z.string().trim(),
    description: z.string().trim().optional(),
})

export const validationRuleGroupsListSchema =
    validationRuleGroupsBaseSchema.merge(withDefaultListColumns)
