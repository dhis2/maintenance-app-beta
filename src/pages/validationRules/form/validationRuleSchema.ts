import { z } from 'zod'
import { modelFormSchemas } from '../../../lib'
import { Expression, ValidationRule } from '../../../types/generated'

const { withDefaultListColumns, withAttributeValues, referenceCollection } =
    modelFormSchemas

const expressionSchema = z.object({
    expression: z.string(),
    description: z.string(),
    displayDescription: z.string().optional(),
    missingValueStrategy: z
        .nativeEnum(Expression.missingValueStrategy)
        .optional()
        .or(z.string().optional()),
    slidingWindow: z.boolean().optional(),
})

const validationRuleBaseSchema = z.object({
    name: z.string().trim(),
    description: z.string().trim().optional(),
    instruction: z.string().trim().optional(),
    importance: z
        .nativeEnum(ValidationRule.importance)
        .default(ValidationRule.importance.MEDIUM)
        .optional(),
    operator: z.nativeEnum(ValidationRule.operator).optional(),
    periodType: z.nativeEnum(ValidationRule.periodType).optional(),
    leftSide: expressionSchema.optional(),
    rightSide: expressionSchema.optional(),
    skipFormValidation: z.boolean().default(false).optional(),
    organisationUnitLevels: z.array(z.number()).default([]).optional(),
    validationRuleGroups: referenceCollection.default([]).optional(),
    legendSets: referenceCollection.default([]).optional(),
    notificationTemplates: referenceCollection.default([]).optional(),
})

export const validationRuleListSchema = validationRuleBaseSchema
    .merge(withDefaultListColumns)
    .merge(withAttributeValues)
    .extend({
        importance: z.nativeEnum(ValidationRule.importance),
        displayDescription: z.string().optional(),
        displayInstruction: z.string().optional(),
        displayFormName: z.string().optional(),
        dimensionItem: z.string().optional(),
    })
