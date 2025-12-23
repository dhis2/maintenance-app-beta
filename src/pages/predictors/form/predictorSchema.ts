import { z } from 'zod'
import { modelFormSchemas } from '../../../lib'
import { Predictor } from '../../../types/generated/models'

const { withDefaultListColumns, withAttributeValues, modelReference } =
    modelFormSchemas

const predictorBaseSchema = z.object({
    shortName: z.string().trim(),
    code: z.string().trim().optional(),
    description: z.string().trim().optional(),
    output: modelReference.extend({ displayName: z.string().optional() }),
    outputCombo: modelReference.extend({ displayName: z.string().optional() }),
    periodType: z
        .nativeEnum(Predictor.periodType)
        .default(Predictor.periodType.MONTHLY),
    organisationUnitLevels: z.array(modelReference).default([]),
    organisationUnitDescendants: z
        .nativeEnum(Predictor.organisationUnitDescendants)
        .default(Predictor.organisationUnitDescendants.DESCENDANTS),
    sequentialSampleCount: z.number().default(0),
    annualSampleCount: z.number().default(0),
    sequentialSkipCount: z.number().default(0),
    predictorGroups: z.array(modelReference).default([]),
})

export const predictorListSchema = predictorBaseSchema
    .merge(withDefaultListColumns)
    .merge(withAttributeValues)
    .extend({
        name: z.string(),
    })
