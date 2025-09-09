import { z } from 'zod'
import { modelFormSchemas } from '../../../lib'

const { withDefaultListColumns } = modelFormSchemas

const validationRuleGroupsBaseSchema = z.object({
    code: z.string().trim().optional(),
    shortName: z.string().trim(),
    name: z.string().trim(),
    description: z.string().trim().optional(),
    value: z.number(),
})

export const validationRuleGroupsListSchema = validationRuleGroupsBaseSchema
    .merge(withDefaultListColumns)
    .extend({
        displayShortName: z.string(),
    })
