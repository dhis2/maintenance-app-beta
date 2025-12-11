import { z } from 'zod'
import { getDefaults, modelFormSchemas } from '../../../../lib'

const { identifiable, withAttributeValues } = modelFormSchemas

export const stageSchema = identifiable.merge(withAttributeValues).extend({
    description: z.string().optional(),
})

export const initialStageValue = getDefaults(stageSchema)
