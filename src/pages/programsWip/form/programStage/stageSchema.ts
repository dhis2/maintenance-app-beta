import { z } from 'zod'
import { getDefaults, modelFormSchemas } from '../../../../lib'

const {
    identifiable,
    modelReference,
    withAttributeValues,
    style,
    withDefaultListColumns,
} = modelFormSchemas

export const stageSchema = identifiable.merge(withAttributeValues).extend({
    description: z.string().optional(),
    style: style.optional(),
    enableUserAssignment: z.boolean().optional(),
    featureType: z.enum(['NONE', 'POINT', 'POLYGON']).optional(),
    validationStrategy: z
        .enum(['ON_COMPLETE', 'ON_UPDATE_AND_INSERT'])
        .default('ON_COMPLETE'),
    preGenerateUID: z.boolean().optional(),
    executionDateLabel: z.string().optional(),
    dueDateLabel: z.string().optional(),
    programStageLabel: z.string().optional(),
    eventLabel: z.string().optional(),
    program: modelReference,
})

export const stageListSchema = stageSchema.merge(withDefaultListColumns)

export const initialStageValue = getDefaults(stageSchema)
