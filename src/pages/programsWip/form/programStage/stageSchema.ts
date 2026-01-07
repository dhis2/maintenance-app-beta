import { z } from 'zod'
import { getDefaults, modelFormSchemas } from '../../../../lib'

const { identifiable, modelReference, withAttributeValues } = modelFormSchemas

export const stageSchema = identifiable.merge(withAttributeValues).extend({
    description: z.string().optional(),
    style: z
        .object({
            color: z.string().optional(),
            icon: z.string().optional(),
        })
        .optional(),
    enableUserAssignment: z.boolean().optional(),
    featureType: z.enum(['NONE', 'POINT', 'POLYGON']).optional(),
    preGenerateUID: z.boolean().optional(),
    executionDateLabel: z.string().optional(),
    dueDateLabel: z.string().optional(),
    programStageLabel: z.string().optional(),
    eventLabel: z.string().optional(),
    program: modelReference,
})

export const initialStageValue = getDefaults(stageSchema)
