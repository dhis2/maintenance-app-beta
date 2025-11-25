import { z } from 'zod'
import { getDefaults, modelFormSchemas } from '../../../../lib'

const { identifiable } = modelFormSchemas

export const stageSchema = identifiable.extend({
    description: z.string().optional(),
})

export const initialStageValue = getDefaults(stageSchema)
