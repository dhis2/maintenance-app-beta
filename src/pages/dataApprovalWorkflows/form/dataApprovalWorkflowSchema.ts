import { z } from 'zod'
import {
    getDefaultsOld,
    createFormValidate,
    modelFormSchemas,
} from '../../../lib'

const { identifiable, withDefaultListColumns } = modelFormSchemas

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

export const dataApprovalWorkflowFormSchema = identifiable
    .merge(dataApprovalWorkflowBaseSchema)
    .extend({
        periodType: z.string().trim(),
        categoryCombo: z.object({ id: z.string() }),
    })

export const dataApprovalWorkflowListSchema =
    dataApprovalWorkflowBaseSchema.merge(withDefaultListColumns)

export const initialValues = getDefaultsOld(dataApprovalWorkflowFormSchema)

export const validate = createFormValidate(dataApprovalWorkflowFormSchema)
