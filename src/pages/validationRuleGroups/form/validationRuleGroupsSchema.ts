import { z } from 'zod'
import { modelFormSchemas, getDefaults, createFormValidate } from '../../../lib'

const { identifiable, withDefaultListColumns, withAttributeValues } =
    modelFormSchemas

const validationRuleGroupsBaseSchema = z.object({
    code: z.string().trim().optional(),
    name: z.string().trim(),
    description: z.string().trim().optional(),
    /*validationRules: z
        .array(
            z.object({
                id: z.string().optional(),
            })
        )
        .optional()
        .default([]),*/
})

export const validationRuleGroupsListSchema =
    validationRuleGroupsBaseSchema.merge(withDefaultListColumns)

export const validationRuleGroupsFormSchema = identifiable
    .merge(validationRuleGroupsBaseSchema)
    // .merge(withAttributeValues)
    .extend({
        shortName: z.string().trim(),
        validationRules: z
            .array(
                z.object({
                    id: z.string().optional(),
                })
            )
            .optional()
            .default([]),
    })

export const initialValues = getDefaults(validationRuleGroupsFormSchema)
export const validate = createFormValidate(validationRuleGroupsFormSchema)
