import { z } from 'zod'
import { modelFormSchemas } from '../../../lib'

const { withDefaultListColumns, withAttributeValues } = modelFormSchemas

const dataApprovalWorkflowBaseSchema = z.object({
    name: z.string().trim(),
    periodType: z.string().trim(),
    categoryCombo: z
        .object({
            id: z.string(),
        })
        .optional(),
    dataSets: z
        .array(
            z.object({
                id: z.string(),
            })
        )
        .default([]),
    dataApprovalLevels: z
        .array(
            z.object({
                id: z.string(),
            })
        )
        .default([]),
})

export const dataApprovalWorkflowListSchema = dataApprovalWorkflowBaseSchema
    .merge(withDefaultListColumns)
    .merge(withAttributeValues)
