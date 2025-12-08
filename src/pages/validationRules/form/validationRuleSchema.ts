import { z } from 'zod'
import { createFormValidate, getDefaults, modelFormSchemas } from '../../../lib'
import { Expression, ValidationRule } from '../../../types/generated'

const { withDefaultListColumns, identifiable, withAttributeValues } =
    modelFormSchemas

// Expression is a reference type, not a nested object in the API
// leftSide and rightSide are Expression references with their own IDs
const validationRuleBaseSchema = z.object({
    code: z.string().trim().optional(),
    name: z.string().trim().min(1),
    shortName: z.string().trim().optional(),
    description: z.string().trim().optional(),
    // leftSide and rightSide are Expression objects, not nested in the validation rule
    leftSide: z
        .object({
            expression: z.string().optional(),
            description: z.string().optional(),
            missingValueStrategy: z
                .nativeEnum(Expression.missingValueStrategy)
                .optional()
                .default(Expression.missingValueStrategy.NEVER_SKIP),
            slidingWindow: z.boolean().optional().default(false),
        })
        .optional(),
    operator: z
        .nativeEnum(ValidationRule.operator)
        .default(ValidationRule.operator.NOT_EQUAL_TO),
    rightSide: z
        .object({
            expression: z.string().optional(),
            description: z.string().optional(),
            missingValueStrategy: z
                .nativeEnum(Expression.missingValueStrategy)
                .optional()
                .default(Expression.missingValueStrategy.NEVER_SKIP),
            slidingWindow: z.boolean().optional().default(false),
        })
        .optional(),
    instruction: z.string().trim().optional(),
    periodType: z
        .nativeEnum(ValidationRule.periodType)
        .default(ValidationRule.periodType.MONTHLY),
    importance: z
        .nativeEnum(ValidationRule.importance)
        .default(ValidationRule.importance.MEDIUM),
    skipFormValidation: z.boolean().optional().default(false),
    organisationUnitLevels: z.array(z.number()).optional().default([]),
})

export const validationRuleListSchema = validationRuleBaseSchema
    .merge(withAttributeValues)
    .merge(withDefaultListColumns)

export const validationRuleFormSchema = validationRuleBaseSchema
    .merge(identifiable)
    .merge(withAttributeValues)

export const initialValues = getDefaults(validationRuleFormSchema)
export const validate = createFormValidate(validationRuleFormSchema)
