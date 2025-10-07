import { z } from 'zod'
import { modelFormSchemas } from '../../../lib'

const { withDefaultListColumns, withAttributeValues } = modelFormSchemas

const dataApprovalLevelBaseSchema = z.object({
    name: z.string().trim(),
    orgUnitLevel: z.number().optional(),
    categoryOptionGroupSet: z
        .object({
            id: z.string(),
        })
        .optional(),
})

export const dataApprovalLevelListSchema = dataApprovalLevelBaseSchema
    .merge(withDefaultListColumns)
    .merge(withAttributeValues)
