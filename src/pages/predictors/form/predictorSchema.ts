import { z } from 'zod'
import { getDefaults, modelFormSchemas } from '../../../lib'
import { createFormValidate } from '../../../lib/form/validate'
import { Predictor, Expression } from '../../../types/generated/models'

const {
    identifiable,
    withDefaultListColumns,
    modelReference,
    referenceCollection,
} = modelFormSchemas

const predictorBaseSchema = z.object({
    shortName: z.string().trim(),
    code: z.string().trim().optional(),
    description: z.string().trim().optional(),
    output: modelReference.extend({ displayName: z.string().optional() }),
    outputCombo: modelReference
        .extend({ displayName: z.string().optional() })
        .optional(),
    periodType: z
        .nativeEnum(Predictor.periodType)
        .default(Predictor.periodType.MONTHLY),
    organisationUnitLevels: z.array(modelReference).default([]),
    organisationUnitDescendants: z
        .nativeEnum(Predictor.organisationUnitDescendants)
        .default(Predictor.organisationUnitDescendants.DESCENDANTS),
    sequentialSampleCount: z.number().int().default(0),
    annualSampleCount: z.number().int().min(0).max(10).default(0),
    sequentialSkipCount: z.number().int().optional(),
    predictorGroups: z.array(modelReference).default([]),
})

export const predictorListSchema = predictorBaseSchema
    .merge(withDefaultListColumns)
    .extend({
        name: z.string(),
    })

export const predictorFormSchema = predictorBaseSchema
    .merge(identifiable)
    .extend({
        formName: z.string().optional(),
        generator: z.object({
            expression: z.string(),
            description: z.string(),
            missingValueStrategy: z
                .nativeEnum(Expression.missingValueStrategy)
                .optional(),
        }),
        sampleSkipTest: z
            .object({
                expression: z.string().optional(),
                description: z.string().optional(),
                missingValueStrategy: z
                    .nativeEnum(Expression.missingValueStrategy)
                    .default(Expression.missingValueStrategy.NEVER_SKIP)
                    .optional(),
            })
            .optional(),
        organisationUnitLevel: referenceCollection.default([]),
    })

export const initialValues = getDefaults(predictorFormSchema)
export const validate = createFormValidate(predictorFormSchema)
