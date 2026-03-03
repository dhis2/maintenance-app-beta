import { z } from 'zod'
import {
    createFormValidate,
    getDefaultsOld,
    modelFormSchemas,
} from '../../../lib'

const { withDefaultListColumns, identifiable } = modelFormSchemas

const validationRuleGroupsBaseSchema = z.object({
    code: z.string().trim().optional(),
    name: z.string().trim(),
    description: z.string().trim().optional(),
})

export const validationRuleGroupsListSchema =
    validationRuleGroupsBaseSchema.merge(withDefaultListColumns)

export const validationRuleGroupsFormSchema = validationRuleGroupsBaseSchema
    .merge(identifiable)
    .extend({
        validationRules: z
            .array(
                z.object({
                    id: z.string().optional(),
                })
            )
            .optional()
            .default([]),
    })

export const initialValues = getDefaultsOld(validationRuleGroupsFormSchema)
export const validate = createFormValidate(validationRuleGroupsFormSchema)
