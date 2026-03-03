import { z } from 'zod'
import {
    createFormValidate,
    getDefaultsOld,
    modelFormSchemas,
} from '../../../lib'
import { Expression, ValidationRule } from '../../../types/generated'

const { withDefaultListColumns, identifiable, withAttributeValues } =
    modelFormSchemas

const validationRuleBaseSchema = z.object({
    code: z.string().trim().optional(),
    name: z.string().trim().min(1),
    shortName: z.string().trim().optional(),
    description: z.string().trim().optional(),
    leftSide: z.object({
        expression: z.string().optional(),
        description: z.string().optional(),
        missingValueStrategy: z
            .nativeEnum(Expression.missingValueStrategy)
            .default(Expression.missingValueStrategy.NEVER_SKIP),
        slidingWindow: z.boolean().optional().default(false),
    }),
    operator: z
        .nativeEnum(ValidationRule.operator)
        .default(ValidationRule.operator.NOT_EQUAL_TO),
    rightSide: z.object({
        expression: z.string().optional(),
        description: z.string().optional(),
        missingValueStrategy: z
            .nativeEnum(Expression.missingValueStrategy)
            .default(Expression.missingValueStrategy.NEVER_SKIP),
        slidingWindow: z.boolean().optional().default(false),
    }),
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

export const initialValues = getDefaultsOld(validationRuleFormSchema)
export const validate = createFormValidate(validationRuleFormSchema)
